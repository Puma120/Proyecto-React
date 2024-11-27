import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialOrders = [
  {
    id: 'ORD-001',
    tableNumber: '5',
    items: [
      { name: 'Hamburguesa Clásica', quantity: 2 },
      { name: 'Papas Fritas', quantity: 1 },
      { name: 'Refresco', quantity: 2 }
    ],
    timestamp: new Date().toLocaleTimeString()
  },
  {
    id: 'ORD-002',
    tableNumber: '3',
    items: [
      { name: 'Pizza Margarita', quantity: 1 },
      { name: 'Ensalada César', quantity: 1 }
    ],
    timestamp: new Date().toLocaleTimeString()
  }
];

const KitchenOrdersInterface = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleCompleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Órdenes en Cocina</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="w-full">
            <CardHeader>
              <CardTitle>Orden {order.id}</CardTitle>
              <p className="text-sm text-gray-500">Mesa {order.tableNumber}</p>
              <p className="text-xs text-gray-400">Recibida: {order.timestamp}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-bold">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="mr-2 border-green-500 text-green-500 hover:bg-green-100"
                onClick={() => handleCompleteOrder(order.id)}
              >
                Completar
              </Button>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-100"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancelar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No hay órdenes pendientes
        </div>
      )}
    </div>
  );
};

export default KitchenOrdersInterface;