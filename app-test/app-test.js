/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.Loader.setPath('MoneyPot', '/app/');

Ext.define('MoneyPotTest.Application', {
    extend: 'Ext.app.Application',

    name: 'MoneyPotTest',

    stores: [
        // TODO: add global / shared stores here
    ],

    autoCreateViewport: 'MoneyPot.view.main.Main',

    launch: function () {
        //hide all ExtJS stuff from page
        Ext.each(Ext.getCmp("main-vp").items.items, function(){this.hide()});
        //include the tests in the test.html head
        jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
        jasmine.getEnv().execute();
    }
});

Ext.application('MoneyPotTest.Application');