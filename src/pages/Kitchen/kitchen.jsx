import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { obtainOrders, obtainMenu, obtainTables } from '@/services/kitchen';

const KitchenOrdersInterface = () => {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { orders, error } = await obtainOrders();
      const { menu, error: menuError } = await obtainMenu();
      const { tables, error: tablesError } = await obtainTables();
      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(orders);
        setMenu(menu);
        setTables(tables);
      }
    };
    fetchOrders();
  }, []);

  const getItemDetails = (itemId) => {
    return menu.find((menuItem) => menuItem.id === itemId);
  };

  const groupItems = (items) => {
    const itemCounts = {};
    items.forEach((itemId) => {
      if (itemCounts[itemId]) {
        itemCounts[itemId] += 1;
      } else {
        itemCounts[itemId] = 1;
      }
    });
    return itemCounts;
  };

  const getTableNumber = (mesaId) => {
    const table = tables.find((table) => table.id === mesaId);
    return table ? table.number : 'Desconocido'; // Si no se encuentra la mesa, devuelve "Desconocido"
  };

  const handleCompleteOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Órdenes en Cocina</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const groupedItems = groupItems(order.items);
          const tableNumber = getTableNumber(order.mesaId); // Obtener el número de mesa
          return (
            <Card key={order.id} className="w-full">
              <CardHeader>
                <CardTitle>Orden ID: {order.id}</CardTitle>
                <p className="text-sm text-gray-500">Mesa {tableNumber}</p> {/* Mostrar número de mesa */}
                <p className="text-xs text-gray-400">
                  Recibida: {new Date(order.created).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(groupedItems).map(([itemId, quantity]) => {
                    const itemDetails = getItemDetails(itemId);
                    if (!itemDetails) return null;
                    return (
                      <li key={itemId} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img src={itemDetails.image} alt={itemDetails.name} className="w-10 h-10 mr-2" />
                          <span>{itemDetails.name}</span>
                        </div>
                        <span className="font-bold">x{quantity}</span>
                      </li>
                    );
                  })}
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
          );
        })}
      </div>
      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No hay órdenes pendientes</div>
      )}
    </div>
  );
};

export default KitchenOrdersInterface;
