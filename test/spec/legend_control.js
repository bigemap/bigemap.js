describe('L.bigemap.legendControl', function() {
    it('constructor', function() {
        var legend = L.bigemap.legendControl();
        expect(legend).to.be.ok();
    });

    describe('#addLegend', function() {
        it('returns the legend object', function() {
            var legend = L.bigemap.legendControl();
            expect(legend.addLegend('foo')).to.eql(legend);
            expect(legend instanceof L.bigemap.LegendControl).to.eql(true);
        });

        it('adds a map legend element to its container', function() {
            var elem = document.createElement('div');
            var map = L.bigemap.map(elem);
            var legend = L.bigemap.legendControl();
            legend.addTo(map);
            expect(legend.addLegend('foo')).to.eql(legend);
            expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend">foo</div>');
        });

        it('handles multiple legends', function() {
            var elem = document.createElement('div');
            var map = L.bigemap.map(elem);
            var legend = L.bigemap.legendControl();
            expect(legend.addTo(map)).to.eql(legend);
            expect(legend.addLegend('foo')).to.eql(legend);
            expect(legend.addLegend('bar')).to.eql(legend);
            expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend">foo</div><div class="map-legend wax-legend">bar</div>');
        });
    });

    describe('#removeLegend', function() {
        it('returns the legend object', function() {
            var legend = L.bigemap.legendControl();
            expect(legend.addLegend('foo')).to.eql(legend);
            expect(legend.removeLegend('foo')).to.eql(legend);
            expect(legend.removeLegend()).to.eql(legend);
        });

        it('adds and removes dom elements', function() {
            var elem = document.createElement('div');
            var map = L.bigemap.map(elem);
            var legend = L.bigemap.legendControl();
            legend.addTo(map);
            expect(legend.addLegend('foo')).to.eql(legend);
            expect(legend.addLegend('bar')).to.eql(legend);
            expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend">foo</div><div class="map-legend wax-legend">bar</div>');
            expect(legend.removeLegend('bar')).to.eql(legend);
            expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend">foo</div>');
        });
    });

    it('sanitizes its content', function() {
        var map = L.map(document.createElement('div'));
        var legend = L.bigemap.legendControl().addTo(map);

        legend.addLegend('<script></script>');

        expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend"></div>');
    });

    it('supports a custom sanitizer', function() {
        var map = L.map(document.createElement('div'));
        var legend = L.bigemap.legendControl({
            sanitizer: function(_) { return _; }
        }).addTo(map);

        legend.addLegend('<script></script>');

        expect(legend._container.innerHTML).to.eql('<div class="map-legend wax-legend"><script></script></div>');
    });
});
