const locals = (req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;

  next();
};

const parseMongoError = error => {
  let errorMessage = error.toString();

  if (error && error.code === 11000) {
    errorMessage = errorMessage.replace(/.*dup key: { (.*):.*/, "$1").toUpperCase() + " TAKEN";
  }

  return errorMessage;
}

module.exports = { locals, parseMongoError };
