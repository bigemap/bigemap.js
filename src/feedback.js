import { Evented, Util } from 'leaflet';

const Feedback = Evented.extend({
  data: {},
  record: function (data) {
    Util.extend(this.data, data);
    this.fire('change');
  }
});

export const feedback = new Feedback();

export default feedback;
