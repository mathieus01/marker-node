"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Group extends Model {
  users() {
    return this.belongsToMany("App/Models/User").pivotTable("user_group");
  }

  owner() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Group;
