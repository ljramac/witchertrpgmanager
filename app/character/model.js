const mongoose = require("mongoose");

const base = require("../base/model");

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
  ...base.schema,
  name: { type: String, required: true },
  description: { type: String, required: true },
  advantages: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  meta: {
    type: Object,
    default: {}
  }
});

const CharacterSchema = new Schema({
  ...base.schema,
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Race",
    autopopulate: true
  },
  meta: {
    type: Object,
    default: {}
  }
});

module.exports = {
  Character: mongoose.model("Character", CharacterSchema, "Characters"),
  Race: mongoose.model("Race", RaceSchema, "Races"),
};
