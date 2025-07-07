import { useState } from 'react';
import { addCustomer } from '../api/api';

export default function CustomerForm({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setError('All fields are required.');
      return;
    }

    try {
      await addCustomer({ name, email, phone });
      setName('');
      setEmail('');
      setPhone('');
      setError('');
      onAdd();
    } catch (err) {
      setError('Failed to add customer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h2 className="font-bold mb-2">Add Customer</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="block mb-2 w-full" />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="block mb-2 w-full" />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="block mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
}