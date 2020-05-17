"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Procedure extends Model {
  surgeries() {
    return this.belongsToMany("App/Models/Surgery").pivotTable(
      "surgery_procedure"
    );
  }
}

module.exports = Procedure;
