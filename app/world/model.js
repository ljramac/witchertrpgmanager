const mongoose = require("mongoose");

const base = require("../base/model");

const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  ...base.schema,
  name: { type: String, required: true },
  description: { type: String, required: true },
  meta: {
    type: Object,
    default: {}
  }
});

const KingdomSchema = new Schema({
  ...base.schema,
  name: { type: String, required: true },
  description: { type: String, required: true },
  advantage: { type: String, required: true },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    autopopulate: true
  },
  meta: {
    type: Object,
    default: {}
  }
});

module.exports = {
  Kingdom: mongoose.model("Kingdom", KingdomSchema, "Kingdoms"),
  Region: mongoose.model("Region", RegionSchema, "Regions"),
};
