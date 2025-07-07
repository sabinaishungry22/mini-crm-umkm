import { useState } from 'react';
import { addOrder } from '../api/api';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export default function OrderForm({ customerId, onAdd }: { customerId: string; onAdd: () => void }) {
  const [items, setItems] = useState<OrderItem[]>([{ name: '', price: 0, quantity: 1 }]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate items
    const invalidItem = items.find(item => !item.name || item.price <= 0 || item.quantity <= 0);
    if (invalidItem) {
      setError('Please fill all item fields with valid values (name, positive price/quantity)');
      setIsSubmitting(false);
      return;
    }

    try {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await addOrder({
        customer_id: customerId,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_id: Math.random().toString(36).substring(2, 9) // Simple ID generator
        })),
        total_price: total
      });
      setItems([{ name: '', price: 0, quantity: 1 }]);
      setError('');
      onAdd();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: typeof value === 'string' ? value : Number(value)
    };
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { name: '', price: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h2 className="font-bold text-lg mb-3">Add Order</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {items.map((item, index) => (
        <div key={index} className="mb-3 p-2 border rounded">
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-5">
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">Qty</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-1 flex items-end">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={addNewItem}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          + Add Another Item
        </button>

        <div className="text-right">
          <p className="font-medium">
            Total: ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Processing...' : 'Submit Order'}
          </button>
        </div>
      </div>
    </form>
  );
}