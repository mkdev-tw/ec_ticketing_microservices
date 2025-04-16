import { useRouter } from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => (
      router.push('/orders/[orderId]', `/orders/${order.id}`))
  });

  return (
    <div>
      <h1>Ticket: {ticket.title}</h1>
      <h3>Price: {ticket.price}</h3>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">Finish Order</button>
    </div>
  );
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
}

export default TicketShow;