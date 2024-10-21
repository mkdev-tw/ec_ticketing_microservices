import { Listener, OrderCreatedEvent, Subjects } from "@mkvalidate/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  // Locking a ticket to prevent editing (419)
  // check the orderId to see if the ticket is already reserved
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the odder is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({
      orderId: data.id
    })

    // Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({// we had change type of client inside base-publisher from private to protected
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the msg
    msg.ack();
  }
}
