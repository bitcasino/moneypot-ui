(function () {

    "use strict";
    /**
     * The main application class. An instance of this class is created by app.js when it calls
     * Ext.application(). This is the ideal place to handle application launch and initialization
     * details.
     */

    /* global Ext */

    Ext.define('MoneyPot.Application', {
        extend: 'Ext.app.Application',

        name: 'MoneyPot',

        stores: [
            // TODO: add global / shared stores here
        ],

        launch: function () {
            // TODO - Launch the application
        }
    });
})();