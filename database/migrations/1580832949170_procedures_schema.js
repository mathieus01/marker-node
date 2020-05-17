"use strict";

const Schema = use("Schema");

class ProceduresSchema extends Schema {
  up() {
    this.create("procedures", table => {
      table.increments();
      table.string("name").notNullable();
      table.integer("code").notNullable();
      table.float("value");
      table.float("ch");
      table.timestamps();
    });
  }

  down() {
    this.drop("procedures");
  }
}

module.exports = ProceduresSchema;
