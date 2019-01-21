describe('security', function() {

    var map, element;

    beforeEach(function() {
        element = document.createElement('div');
        document.body.appendChild(element);
        element.style.width = '256px';
        element.style.height = '256px';
        map = L.bigemap.map(element, helpers.tileJSON_malicious);
    });

    afterEach(function() {
        element.parentNode.removeChild(element);
    });

    it('L.bigemap.sharecontrol does not allow XSS attacks', function() {
        map.setView([0,0],0);

        var shareControl = L.bigemap.shareControl(null, { url: 'foobar' });
        expect(shareControl.addTo(map)).to.eql(shareControl);
        
        var calledAttack = false;

        window.launchAttack = function launchAttack() {

                console.log("L.bigemap.sharecontrol launched an XSS attack");

                calledAttack = true;

        }

        happen.click(element.getElementsByClassName('bigemap-share')[0]);

        expect(calledAttack).to.be(false);

    });

});