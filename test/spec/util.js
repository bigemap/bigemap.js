describe('util', function () {
  describe('#lbounds', function () {
    it('generates a L.LLatLngBounds object', function () {
      expect(internals.util.lbounds([0, 1, 2, 3]) instanceof L.LatLngBounds).to.be.true;
    });
  });

  describe('#strict', function () {
    it('throws an error on object/string', function () {
      expect(function () {
        internals.util.strict({}, 'string');
      }).to.throw('Invalid argument: string expected');
      expect(function () {
        internals.util.strict('foo', 'object');
      }).to.throw('Invalid argument: object expected');
    });
    it('throws an error on string/number', function () {
      expect(function () {
        internals.util.strict(5, 'string');
      }).to.throw('Invalid argument: string expected');
      expect(function () {
        internals.util.strict('5', 'number');
      }).to.throw('Invalid argument: number expected');
    });
  });

  describe('#strict_oneof', function () {
    it('does not throw an error when in list', function () {
      expect(function () {
        internals.util.strict_oneof('a', ['a']);
      }).to.not.throw();
    });
    it('throws an error when not in list', function () {
      expect(function () {
        internals.util.strict_oneof('c', ['a']);
      }).to.throw('Invalid argument: c given, valid values are a');
    });
  });

  describe('#strip_tags', function () {
    it('strips a basic tag', function () {
      expect(internals.util.strip_tags('<div>foo</div>')).to.eql('foo');
    });
    it('strips a self-closing tag', function () {
      expect(internals.util.strip_tags('foo <br /> bar')).to.eql('foo  bar');
    });
    it('does not botch non-tag input', function () {
      expect(internals.util.strip_tags('rabbit')).to.eql('rabbit');
    });
  });
});
