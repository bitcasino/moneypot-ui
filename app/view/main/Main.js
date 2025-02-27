(function () {

    "use strict";
    /**
     * This class is the main view for the application. It is specified in app.js as the
     * "autoCreateViewport" property. That setting automatically applies the "viewport"
     * plugin to promote that instance of this class to the body element.
     *
     * TODO - Replace this content of this view to suite the needs of your application.
     */

    /* global Ext */

    Ext.define('MoneyPot.view.main.Main', {
        extend: 'Ext.container.Container',
        requires: [
            'MoneyPot.view.main.MainController',
            'MoneyPot.view.main.MainModel'
        ],

        id: 'main-vp',

        xtype: 'app-main',

        controller: 'main',
        viewModel: {
            type: 'main'
        },

        layout: {
            type: 'border'
        },

        items: [{
            xtype: 'panel',
            bind: {
                title: '{name}'
            },
            region: 'west',
            html: '<ul><li>This area is commonly used for navigation, for example, using a "tree" component.</li></ul>',
            width: 250,
            split: true,
            tbar: [{
                text: 'Button',
                id: "cmp-button",
                handler: 'onClickButton'
            }]
        }, {
            region: 'center',
            xtype: 'tabpanel',
            items: [{
                title: 'Tab 1',
                html: '<h2>Content appropriate for the current navigation.</h2>'
            }]
        }]
    });
})();