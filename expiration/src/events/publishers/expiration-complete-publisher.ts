import { Subjects, Publisher, ExpirationCompleteEvent } from '@mkvalidate/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
