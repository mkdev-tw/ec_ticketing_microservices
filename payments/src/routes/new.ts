import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from "@mkvalidate/common";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/patment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }


    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true
        }
      });

      const payment = Payment.build({
        orderId,
        stripeId: paymentIntent.id
      });
      await payment.save();

      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
      });

      res.status(201).send({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`
      });

    } catch (e) {
      console.log(e);
    }
  });

export { router as createChargeRouter };