
exports.up = function(knex) {
  return knex.schema.createTable('participants', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone');
    table.integer('event_id').unsigned().references('id').inTable('events').onDelete('RESTRICT');
    table.enu('status', ["registered", "attended", "cancelled"]).defaultTo('registered');
    table.string('ticket_code').notNullable().unique();
    table.string('ticket_type').notNullable();
    table.string('ticket_price').notNullable();
    table.enu('payment_status', ["pending", "paid", "refunded"]).defaultTo('pending');
    table.dateTime('payment_date');
    table.string('payment_proof_url');
    table.string('payment_method').defaultTo('bank_transfer');
    table.string('payment_reference_number').unique();
    table.dateTime('refund_date');
    table.string('refund_reason');
    table.string('refund_proof_url');
    table.enu('refund_status', ["pending", "approved", "rejected"]).defaultTo('pending');
    table.string('refund_reference_number').unique();
    table.timestamps(true, true);
  }
  );
};

exports.down = function(knex) {
  return knex.schema.dropTable('participants');
};
