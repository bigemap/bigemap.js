describe('L.CRS.Baidu', function () {
  const crs = L.CRS.Baidu;

  it('convert zoom to scale and viceversa and return the same values', () => {
    const zoom = 2.5;
    const scale = crs.scale(zoom);
    const zoom2 = crs.zoom(scale);
    expect(L.Util.formatNum(zoom2)).to.eql(zoom);
  });
});
