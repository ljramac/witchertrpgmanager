const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const base = require("../base/model");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  ...base.schema,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    index: true,
  },
  firstname: {
    type: String,
    index: true,
    default: null
  },
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Character",
    autopopulate: true
  },
  meta: {
    type: Object,
    default: {
      isAdmin: false
    }
  }
});

UserSchema.pre("find", base.prefind);

UserSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;

        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

UserSchema.statics.createOrUpdate = function (condition, payload = condition) {
  return new Promise(async (resolve, reject) => {
    try {
      let document = await this.findOne({ ...condition });

      if (!document) {
        document = await this.create(payload);
      } else {
        Object.assign(document, payload);

        await document.save();
      }

      resolve(document);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = mongoose.model("User", UserSchema, "Users");
