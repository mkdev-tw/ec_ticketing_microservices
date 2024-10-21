import { Subjects, Publisher, PaymentCreatedEvent } from "@mkvalidate/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}