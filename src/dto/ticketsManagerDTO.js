class TicketsDTO {
  constructor(ticket) {
    this.code = ticket.code; 
    this.purchase_datetime = ticket.purchase_datetime;
    this.purchaser = ticket.purchaser;
    this.amount = ticket.amount;  
  }
}

module.exports = TicketsDTO;