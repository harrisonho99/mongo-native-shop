exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};
exports.errorOccured = (_, res) => {
  res.render('errorOccured', {
    pageTitle: 'Error Occured!',
    path: '/errorOccured',
  });
};
