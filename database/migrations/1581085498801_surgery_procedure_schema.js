'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SurgeryProcedureSchema extends Schema {
  up() {
    this.create('surgery_procedure', (table) => {
      table.increments();
      table
        .integer('surgery_id')
        .unsigned()
        .references('id')
        .inTable('surgeries')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable();
      table
        .integer('procedure_id')
        .unsigned()
        .references('id')
        .inTable('procedures')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable();
    });
  }

  down() {
    this.drop('surgery_procedure');
  }
}

module.exports = SurgeryProcedureSchema;
