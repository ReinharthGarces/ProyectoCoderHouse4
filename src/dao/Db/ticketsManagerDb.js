const ticketModel = require('../models/ticketModel');
const shortid = require('shortid');

class TicketsManager {
  async generateTicket( totalAmount, email ) {
    try {
      const ticketCode = shortid.generate();
      const ticket = ticketModel.create({
        code: ticketCode,
        amount: totalAmount,
        purchaser: email,
      });
      return ticket;
    } catch (error) {
      console.error('Error detallado', error);
      throw new Error('Error al generar el ticket', error);
    }
  }
}

module.exports = TicketsManager;