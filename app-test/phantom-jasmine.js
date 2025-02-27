// Part of OpenPhantomScripts
// http://github.com/mark-rushakoff/OpenPhantomScripts

// Copyright (c) 2012 Mark Rushakoff

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var fs = require("fs");
var args, url, lengthOkay, appName, system;
try {
    system = require("system");
    // if we got here, we are on PhantomJS 1.5+
    args = system.args;
    lengthOkay = (args.length === 2);
    appName = args[0];
    url = args[1];
} catch (e) {
    // otherwise, assume PhantomJS 1.4
    args = phantom.args;
    lengthOkay = (args.length === 1);
    appName = 'phantom-qunit.js'
    url = args[0];
}

if (!lengthOkay) {
    printError("Usage: " + appName + " URL");
    phantom.exit(1);
}

function printError(message) {
    fs.write("/dev/stderr", message + "\n", "w");
}

var page = require("webpage").create();

var attachedDoneCallback = false;
page.onResourceReceived = function() {
    // Without this guard, I was occasionally seeing the done handler
    // pushed onto the array multiple times -- it looks like the
    // function was queued up several times, depending on the server.
    if (!attachedDoneCallback) {
        attachedDoneCallback = page.evaluate(function() {
            if (window.jasmine) {
                var reporter = {
                    numPassed: 0,
                    numFailed: 0,
                    numSkipped: 0,

                    reportRunnerStarting: function() {
                        this.startTime = (new Date()).getTime();
                    },

                    reportSpecResults: function(spec) {
                        var results = spec.results();
                        if (results.skipped) {
                            this.numSkipped++;
                        } else if (results.passed()) {
                            this.numPassed++;
                        } else {
                            this.numFailed++;
                        }
                    },

                    reportRunnerResults: function() {
                        var totalTime = (new Date()).getTime() - this.startTime;
                        var totalTests = (this.numPassed + this.numSkipped + this.numFailed);
                        console.log("Tests passed:  " + this.numPassed);
                        console.log("Tests skipped: " + this.numSkipped);
                        console.log("Tests failed:  " + this.numFailed);
                        console.log("Total tests:   " + totalTests);
                        console.log("Runtime (ms):  " + totalTime);
                        window.phantomComplete = true;
                        window.phantomResults = {
                            numPassed: this.numPassed,
                            numSkipped: this.numSkipped,
                            numFailed: this.numFailed,
                            totalTests: totalTests,
                            totalTime: totalTime
                        };
                    }
                };

                reporter.prototype = window.jasmine.Reporter.prototype;

                window.jasmine.getEnv().addReporter(reporter);

                return true;
            }

            return false;
        });
    }
}

page.onConsoleMessage = function(message) {
    console.log(message);
}

page.open(url, function(success) {
    if (success === "success") {
        if (!attachedDoneCallback) {
            printError("Phantom callbacks not attached in time.  See http://github.com/mark-rushakoff/OpenPhantomScripts/issues/1");
            phantom.exit(1);
        }

        detailed = function(){
            var exitCode = page.evaluate(function(){
                try {
                    console.log('');
                    console.log(document.body.querySelector('.description').innerText);
                    var list = document.body.querySelectorAll('.results > #details > .specDetail.failed');
                    if (list && list.length > 0) {
                        console.log('');
                        console.log(list.length + ' test(s) FAILED:');
                        for (i = 0; i < list.length; ++i) {
                            var el = list[i],
                                desc = el.querySelector('.description'),
                                msg = el.querySelector('.resultMessage.fail');
                            console.log('');
                            console.log(desc.innerText);
                            console.log(msg.innerText);
                            console.log('');
                        }
                        return 1;
                    } else {
                        console.log(document.body.querySelector('.alert > .passingAlert.bar').innerText);
                        return 0;
                    }
                } catch (ex) {
                    console.log(ex);
                    return 1;
                }
            });

            page.evaluate(function(){
                jscoverage_report('phantom');
            });

            phantom.exit(exitCode);
        };

        setInterval(function() {
            if (page.evaluate(function() {return window.phantomComplete;})) {
                var failures = page.evaluate(function() {return window.phantomResults.numFailed;});
                //phantom.exit(failures);
                detailed();
            }
        }, 250);
    } else {
        printError("Failure opening " + url);
        phantom.exit(1);
    }
});