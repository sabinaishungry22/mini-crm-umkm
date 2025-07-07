import { useState } from 'react';
import { addOrder } from '../api/api';

export default function OrderForm({ customerId, onAdd }: { customerId: string; onAdd: () => void }) {
  const [items, setItems] = useState('');
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items || total <= 0) {
      setError('Please enter items and a valid total price.');
      return;
    }

    try {
      await addOrder({ customer_id: customerId, items: items.split(',').map(i => i.trim()), total_price: total });
      setItems('');
      setTotal(0);
      setError('');
      onAdd();
    } catch (err) {
      setError('Failed to add order.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h2 className="font-bold">Add Order</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input placeholder="Items (comma separated)" value={items} onChange={e => setItems(e.target.value)} className="block mb-2 w-full" />
      <input type="number" placeholder="Total Price" value={total} onChange={e => setTotal(Number(e.target.value))} className="block mb-2 w-full" />
      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
    </form>
  );
}
