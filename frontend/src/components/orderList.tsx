import { useEffect, useState } from 'react';
import { getOrders } from '../api/api';

export default function OrderList({
  customerId,
  customerName,
  refresh, 
}: {
  customerId: string;
  customerName: string;
  refresh: boolean;
}) {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    if (customerId) {
      const res = await getOrders(customerId);
      setOrders(res.data);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId, refresh]); 

  return (
    <div>
      <h2 className="font-bold mb-2">Orders for customer {customerName}</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.items.join(', ')} — ${order.total_price}
          </li>
        ))}
      </ul>
    </div>
  );
}
