import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// describe what to save inside JOB
interface Payload {
  orderId: string;
}

// Create a queue and connect to redis(439)
const expirationQueue = new Queue<Payload>('order-expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  }
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };