const User = require("./model");
const logger = require("../../services/logger.js");

const login = async (email, password) => {
  try {
    if (!email || !password) return false;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("invalid credentials", { email });

      return false;
    }

    return new Promise(resolve => user.comparePassword(password, (error, isMatch) => {
      if (error || !isMatch) resolve(false);

      resolve(user);
    }));
  } catch (error) {
    logger.warn(error);

    return false;
  }
};

const checkCredentials = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      const user = await User.findById(req.session.user._id).lean();

      if (!user) throw new Error("Not valid user");

      Object.keys(user).forEach(key => {
        req.session.user[key] = user[key];
      });

      req.session.user._id = user._id.toString();

      delete req.session.user.password;

      return next();
    }

    res.redirect("/user/login");
  } catch (error) {
    logger.error(error);

    res.redirect(`/user/login?error=${error.toString()}`);
  }
}

module.exports = { login, checkCredentials };
