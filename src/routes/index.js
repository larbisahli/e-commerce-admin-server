/* eslint-disable no-undef */
module.exports = (app) => {
  app.use('/api/analytics', require('./analytics'));
  app.use('/api/login', require('./login'));
  app.use('/api/upload', require('./upload'));
};
