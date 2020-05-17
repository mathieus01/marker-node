"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Patient extends Model {
  group() {
    return this.belongsTo("App/Models/Group");
  }

  surgeries() {
    return this.hasMany("App/Models/Surgery");
  }
}

module.exports = Patient;
