const mongoose = require("mongoose");

module.exports = {
  schema: {
    createdAt: {
      type: Date,
      index: true,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      index: true,
      default: Date.now()
    },
    deletedAt: {
      type: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  prefind: function (next) {
    this.where({ deletedAt: { $exists: false } });
    this.sort({ createdAt: -1 });
    this.limit(1000);
  
    next();
  }
};
