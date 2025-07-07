import { useEffect, useState } from 'react';
import { getCustomers } from '../api/api';

export default function CustomerList({
  onSelect,
  refresh, 
}: {
    onSelect: (id: string, name: string) => void;
  refresh: boolean;
}) {
  const [customers, setCustomers] = useState<any[]>([]);

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [refresh]); 

  return (
    <div className="mb-4">
      <h2 className="font-bold mb-2">Customers</h2>
      <ul>
        {customers.map((c) => (
          <li
            key={c.id}
            className="cursor-pointer underline text-blue-600"
            onClick={() => onSelect(c.id, c.name)}
          >
            {c.name} ({c.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
