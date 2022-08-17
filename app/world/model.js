const mongoose = require("mongoose");

const base = require("../base/model");

const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  ...base.schema,
  ...base.titleAndDescription,
  meta: {
    type: Object,
    default: {}
  }
});

const KingdomSchema = new Schema({
  ...base.schema,
  ...base.titleAndDescription,
  advantage: { type: String, required: true },
  region: { type: String, required: true },
  meta: {
    type: Object,
    default: {}
  }
});

module.exports = {
  Kingdom: mongoose.model("Kingdom", KingdomSchema, "Kingdoms"),
  Region: mongoose.model("Region", RegionSchema, "Regions"),
};
