import sanitizeHtml from 'sanitize-html';

export const sanitize = sanitizeHtml;
sanitize.defaults.allowedAttributes['*'] = ['class'];

export default sanitize;
