"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PatientSchema extends Schema {
  up() {
    this.create("patients", table => {
      table.increments();
      table.string("name").notNullable();
      table.string("email");
      table.timestamp("birthday");
      table.string("phone");
      table.string("address");
      table.string("gender", 1).notNullable();
      table.string("helthcare");
      table.string("alergy");
      table.string("occupation");
      table
        .integer("group_id")
        .unsigned()
        .references("id")
        .inTable("groups")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table.timestamps();
    });
  }

  down() {
    this.drop("patients");
  }
}

module.exports = PatientSchema;
