const mongoose = require("mongoose");

const base = require("../base/model");

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  ...base.schema,
  ...base.titleAndDescription,
  vigor: { type: Number },
  commonSkill: { type: String },
  skills: [{ type: String }],
  magicalAdvantages: [{ type: String }],
  initialEquipment: [{ type: String }],
  especial: [{ type: String }],
  meta: {
    type: Object,
    default: {}
  }
});

const RaceSchema = new Schema({
  ...base.schema,
  ...base.titleAndDescription,
  advantages: [{ type: String }],
  meta: {
    type: Object,
    default: {}
  }
});

const CharacterSchema = new Schema({
  ...base.schema,
  name: { type: String, required: true },
  stats: {
    type: new Schema({
      pv:    { type: Number, required: true },
      int:   { type: Number, required: true },
      ref:   { type: Number, required: true },
      des:   { type: Number, required: true },
      tco:   { type: Number, required: true },
      mov:   { type: Number, required: true },
      emp:   { type: Number, required: true },
      tec:   { type: Number, required: true },
      vol:   { type: Number, required: true },
      sue:   { type: Number, required: true },
      atu:   { type: Number, required: true },
      agu:   { type: Number, required: true },
      est:   { type: Number, required: true },
      rec:   { type: Number, required: true },
      pun:   { type: Number, required: true },
      pat:   { type: Number, required: true },
      carr:  { type: Number, required: true },
      salt:  { type: Number, required: true },
      vigor: { type: Number, required: true }
    })
  },
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Race",
    autopopulate: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    autopopulate: true
  },
  background: {
    type: new Schema({
      kingdom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kingdom",
        autopopulate: true,
        required: true
      },
      family: { type: String, required: true },
      events: [{ type: String }],
      raw: { type: String, required: true }
    })
  },
  inventory: [{ type: String }],
  gold: { type: Number },
  reputation: { type: Number },
  meta: {
    type: Object,
    default: {}
  }
});

module.exports = {
  Character: mongoose.model("Character", CharacterSchema, "Characters"),
  Race: mongoose.model("Race", RaceSchema, "Races"),
  Job: mongoose.model("Job", JobSchema, "Jobs")
};
