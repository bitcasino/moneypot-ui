/**
 * Created by maxim on 3/11/15.
 */

describe("Basic Assumptions", function() {

    it("has ExtJS4 loaded", function() {
        expect(Ext).toBeDefined();
        expect(Ext.getVersion()).toBeTruthy();
        expect(Ext.getVersion().major).toEqual(5);
    });

    it("has loaded MoneyPot code",function(){
        expect(MoneyPotTest).toBeDefined();
    });

    it("has demo button rendered",function(){
        var btn = Ext.getCmp("cmp-button");
        expect(btn).toBeTruthy();
        expect(btn.el.dom).toBeTruthy();
    });
});