import { useEffect, useState } from 'react';
import { getOrders } from '../api/api';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  total_price: number;
  created_at?: string;
}

export default function OrderList({
  customerId,
  customerName,
  refresh, 
}: {
  customerId: string;
  customerName: string;
  refresh: boolean;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
      const res = await getOrders(customerId);
      // Validate and transform data
      const validatedOrders = res.data.map((order: any) => ({
        id: order.id || 'N/A',
        customer_id: order.customer_id || customerId,
        items: (order.items || []).map((item: any) => ({
          product_id: item.product_id || 'N/A',
          name: item.name || 'Unnamed Item',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        })),
        total_price: Number(order.total_price) || 0,
        created_at: order.created_at,
      }));
      setOrders(validatedOrders);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId, refresh]);

  const formatPrice = (price: number | undefined) => {
    return price?.toFixed?.(2) || '0.00';
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (orders.length === 0) return <div>No orders found for this customer.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Orders for {customerName}</h2>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="border p-3 rounded-lg">
            <div className="font-medium">Order number #{order.id.slice(0, 8)}... {/* Shows first 8 chars */}</div>
            {order.created_at && (
              <div className="text-sm text-gray-600 mb-2">
                {new Date(order.created_at).toLocaleDateString()}
              </div>
            )}
            <ul className="list-disc pl-5 mb-2">
              {order.items.map((item) => (
                <li key={item.product_id}>
                  {item.name} (x{item.quantity}) - ${formatPrice(item.price)} each
                </li>
              ))}
            </ul>
            <div className="font-bold">
              Total: ${formatPrice(order.total_price)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}