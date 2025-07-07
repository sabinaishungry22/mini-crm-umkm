import { useState } from 'react';
import CustomerForm from './components/customerForm';
import OrderForm from './components/orderForm';
import CustomerList from './components/customerList';
import OrderList from './components/orderList';

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [refreshCustomers, setRefreshCustomers] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const handleCustomerAdded = () => {
    setRefreshCustomers(prev => !prev);
  };

  const handleOrderAdded = () => {
    setRefreshOrders(prev => !prev);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Mini CRM</h1>

      <CustomerForm onAdd={handleCustomerAdded} />

      <CustomerList
        onSelect={(id, name) => setSelectedCustomer({ id, name })}
        refresh={refreshCustomers}
      />

      {selectedCustomer && (
        <>
          <OrderForm customerId={selectedCustomer.id} onAdd={handleOrderAdded} />

          {/* ✅ Pass both customerId and customerName */}
          <OrderList
            customerId={selectedCustomer.id}
            customerName={selectedCustomer.name}
            refresh={refreshOrders}
          />
        </>
      )}
    </div>
  );
}

export default App;
