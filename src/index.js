import 'leaflet/dist/leaflet.css';

import bigemap from './bigemap';
import L from 'leaflet';

export * from 'leaflet/src/Leaflet';
export { default as bigemap } from './bigemap';

L.bigemap = bigemap;

export default L;
