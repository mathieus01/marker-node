"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Surgery extends Model {
  patient() {
    return this.belongsTo("App/Models/Patient");
  }

  files() {
    return this.hasMany("App/Models/File");
  }

  procedures() {
    return this.belongsToMany("App/Models/Procedure").pivotTable(
      "surgery_procedure"
    );
  }
}

module.exports = Surgery;
