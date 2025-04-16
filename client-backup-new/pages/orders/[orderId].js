import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from '../../components/CheckoutForm';
import CompletePage from '../../components/CompletePage';

const stripePromise = await loadStripe("pk_test_51Q7y6rB449pJq1ZPQZLqvAWr9tD0eVwZ8ylpRunOrYnaWJKdWwFtAOa0OxUyIxDIMq5RcjnSvANb2x7uNCHMtYaM00T3UBHVeO");

const OrderShow = ({ order }) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const [checkVisible, setCheckVisible] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (paymentIntent) => {
      setClientSecret(paymentIntent.clientSecret);
      setDpmCheckerLink(paymentIntent.dpmCheckerLink);
      setCheckVisible(true);
    }
  });



  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className='App'>
      <div>Time left to pay: {timeLeft} seconds</div>
      {checkVisible && clientSecret && (
        <Elements options={options} stripe={stripePromise}>

          <CheckoutForm dpmCheckerLink={dpmCheckerLink} />

        </Elements>
      )}
      {!checkVisible && (
        <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
      )}
      {errors}
    </div>
  );

};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;