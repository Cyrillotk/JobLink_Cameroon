function notFound(req, res) {
  res.status(404).render('error', {
    title: 'Page not found',
    status: 404,
    message: 'That page does not exist. Check the address or go back to the jobs list.',
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    req.session.error = messages.join(' ');
    return res.redirect('back');
  }

  if (err.code === 11000) {
    req.session.error = 'That record already exists.';
    return res.redirect('back');
  }

  if (err.name === 'CastError') {
    return res.status(404).render('error', {
      title: 'Not found',
      status: 404,
      message: 'That record does not exist.',
    });
  }

  res.status(500).render('error', {
    title: 'Something went wrong',
    status: 500,
    message: 'The server could not complete that request. Try again.',
  });
}

module.exports = { notFound, errorHandler };