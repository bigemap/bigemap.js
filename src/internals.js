import config from './config';
import formatUrl from './format_url';
import request from './request';
import util from './util';

window.internals = {
  url: formatUrl,
  config: config,
  util: util,
  request: request
};
