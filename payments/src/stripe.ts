import Stripe from 'stripe';
import dotevn from 'dotenv';

dotevn.config();

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2024-06-20'
});