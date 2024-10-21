import { Publisher, Subjects, TicketCreatedEvent } from '@mkvalidate/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

