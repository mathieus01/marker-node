"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SurgeriesSchema extends Schema {
  up() {
    this.create("surgeries", table => {
      table.increments();
      table.timestamp("date");
      table.string("cause");
      table.text("text_report");
      table.text("description");
      table.string("type", 1);
      table.string("location");
      table
        .integer("patient_id")
        .unsigned()
        .references("id")
        .inTable("patients")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table.timestamps();
    });
  }

  down() {
    this.drop("surgeries");
  }
}

module.exports = SurgeriesSchema;
