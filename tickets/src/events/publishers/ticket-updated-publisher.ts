import { Publisher, Subjects, TicketUpdatedEvent } from '@mkvalidate/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

