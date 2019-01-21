describe('L.bigemap.template', function() {
    it('renders a moustache template', function() {
        expect(L.bigemap.template('Name: {{name}}', {name: 'John'})).to.equal('Name: John');
    });
});
