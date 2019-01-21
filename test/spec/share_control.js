describe('L.bigemap.shareControl', function() {

    var map, element;

    beforeEach(function() {
        element = document.createElement('div');
        document.body.appendChild(element);
        element.style.width = '256px';
        element.style.height = '256px';
        map = L.bigemap.map(element);
    });

    afterEach(function() {
        element.parentNode.removeChild(element);
    });

    it('can be constructed', function() {
        expect(L.bigemap.shareControl()).to.be.ok();
        expect(L.bigemap.shareControl() instanceof L.bigemap.ShareControl).to.be.ok();
    });

    it('can be added to a map', function() {
        var shareControl = L.bigemap.shareControl();
        expect(shareControl.addTo(map)).to.eql(shareControl);
    });

    it('adds its element to a map', function() {
        var shareControl = L.bigemap.shareControl();
        expect(shareControl.addTo(map)).to.eql(shareControl);
        expect(element
            .getElementsByClassName('leaflet-control-bigemap-share').length)
                .to.eql(1);
    });

    it('shows a share dialog when clicked', function() {
        map.setView([0,0],0);
        var shareControl = L.bigemap.shareControl();
        expect(shareControl.addTo(map)).to.eql(shareControl);

        happen.click(element
            .getElementsByClassName('bigemap-share')[0]);

        expect(element
            .getElementsByClassName('bigemap-modal-body').length)
                .to.eql(1);
    });

    it('constructs iframe URL', function() {
        map.setView([0,0],0);
        var shareControl = L.bigemap.shareControl({id: 'mapid'});
        expect(shareControl.addTo(map)).to.eql(shareControl);

        happen.click(element
            .getElementsByClassName('bigemap-share')[0]);

        expect(element
            .getElementsByClassName('bigemap-embed')[0].value)
            .to.eql('<iframe width="100%" height="500px" frameBorder="0" src="http://a.tiles.bigemap.com/v4/mapid.html?access_token=key"></iframe>');
    });

    it('can accept a custom url', function() {
        map.setView([0,0],0);
        var shareControl = L.bigemap.shareControl(null, { url: 'foobar' });
        expect(shareControl.addTo(map)).to.eql(shareControl);

        happen.click(element
            .getElementsByClassName('bigemap-share')[0]);

        expect(element
            .getElementsByClassName('bigemap-modal-body')[0].innerHTML)
                .to.contain('foobar');
    });

    it('clicking the share button again closes the popup', function() {
        map.setView([0,0],0);
        var shareControl = L.bigemap.shareControl(null, { url: 'foobar' });
        expect(shareControl.addTo(map)).to.eql(shareControl);

        happen.click(element
            .getElementsByClassName('bigemap-share')[0]);

        expect(element
            .getElementsByClassName('bigemap-modal-body').length)
            .to.eql(1);

        happen.click(element
            .getElementsByClassName('bigemap-share')[0]);

        expect(element
            .getElementsByClassName('bigemap-modal-body').length)
            .to.eql(0);
    });
});
