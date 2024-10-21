import { Publisher, OrderCancelledEvent, Subjects } from "@mkvalidate/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}