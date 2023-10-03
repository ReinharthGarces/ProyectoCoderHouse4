const ticketModel = require('../models/ticketModel');
const shortid = require('shortid');

class TicketsManager {
  async generateTicket( email, totalAmount ) {
    try {
      const ticketCode = shortid.generate();
      const ticket = ticketModel.create({
        code: ticketCode,
        purchaser: email,
        amount: totalAmount,
      });
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new Error('Error al generar el ticket', error);
    }
  }
}

module.exports = TicketsManager;