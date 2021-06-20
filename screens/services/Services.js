const GLOBAL = require('../components/constants');
export const fetchResults = () =>
  fetch(`${GLOBAL.SERVER_URL}/api/results`).then(r => r.json());
