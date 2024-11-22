import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const menuCategories = [
  { id: 1, name: 'Entradas' },
  { id: 2, name: 'Platos Fuertes' },
  { id: 3, name: 'Postres' },
  { id: 4, name: 'Bebidas' }
];

const menuItems = [
    { id: 1, category: 1, name: 'Nachos', description: 'Nachos con queso y jalapeños', price: 120, available: true, image: '/api/placeholder/150/100' },
    { id: 5, category: 1, name: 'Guacamole', description: 'Guacamole fresco con totopos', price: 80, available: true, image: '/api/placeholder/150/100' },
    { id: 6, category: 1, name: 'Alitas', description: 'Alitas con salsa BBQ', price: 150, available: true, image: '/api/placeholder/150/100' },
    { id: 7, category: 1, name: 'Tacos Dorados', description: 'Tacos rellenos de papa', price: 100, available: false, image: '/api/placeholder/150/100' },
    
    { id: 2, category: 2, name: 'Filete de Salmón', description: 'Salmón a la parrilla con verduras', price: 250, available: true, image: '/api/placeholder/150/100' },
    { id: 8, category: 2, name: 'Pollo al Horno', description: 'Pollo marinado con hierbas', price: 180, available: true, image: '/api/placeholder/150/100' },
    { id: 9, category: 2, name: 'Costillas BBQ', description: 'Costillas con salsa de la casa', price: 220, available: true, image: '/api/placeholder/150/100' },
    { id: 10, category: 2, name: 'Ravioles', description: 'Ravioles rellenos de espinaca', price: 200, available: true, image: '/api/placeholder/150/100' },
    
    { id: 3, category: 3, name: 'Pastel de Chocolate', description: 'Pastel de chocolate con helado', price: 90, available: true, image: '/api/placeholder/150/100' },
    { id: 11, category: 3, name: 'Tarta de Manzana', description: 'Tarta con manzanas caramelizadas', price: 85, available: true, image: '/api/placeholder/150/100' },
    { id: 12, category: 3, name: 'Flan Casero', description: 'Flan de vainilla', price: 70, available: true, image: '/api/placeholder/150/100' },
    { id: 13, category: 3, name: 'Cheesecake', description: 'Pay de queso con fresas', price: 100, available: false, image: '/api/placeholder/150/100' },
    
    { id: 4, category: 4, name: 'Mojito', description: 'Mojito clásico', price: 80, available: false, image: '/api/placeholder/150/100' },
    { id: 14, category: 4, name: 'Limonada', description: 'Limonada natural', price: 50, available: true, image: '/api/placeholder/150/100' },
    { id: 15, category: 4, name: 'Cerveza Artesanal', description: 'Cerveza de la región', price: 70, available: true, image: '/api/placeholder/150/100' },
    { id: 16, category: 4, name: 'Café Americano', description: 'Café orgánico', price: 40, available: true, image: '/api/placeholder/150/100' }
  ];
  
  const tables = [
    { id: 1, number: 1, status: 'available' },
    { id: 2, number: 2, status: 'occupied' },
    { id: 3, number: 3, status: 'available' },
    { id: 4, number: 4, status: 'occupied' },
    { id: 5, number: 5, status: 'available' },
    { id: 6, number: 6, status: 'occupied' },
    { id: 7, number: 7, status: 'available' },
    { id: 8, number: 8, status: 'occupied' },
    { id: 9, number: 9, status: 'available' },
    { id: 10, number: 10, status: 'available' }
  ];
  

const Client = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart(cart.filter(item => item.id !== itemToRemove.id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 relative">
      {/* Carrito como ícono en esquina superior derecha */}
      <div className="fixed top-4 right-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            DineSpot Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Categorías de Menú */}
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {menuCategories.map(category => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lista de Productos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {menuCategories.find(c => c.id === selectedCategory).name}
              </h2>
              {menuItems
                .filter(item => item.category === selectedCategory)
                .map(item => (
                  <Card key={item.id} className="hover:bg-gray-50">
                    <CardContent className="p-4 flex items-center">
                      {/* Imagen del platillo */}
                      <div className="mr-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="font-bold mr-2">{item.name}</h3>
                          {!item.available && (
                            <Badge variant="destructive">Agotado</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                        <p className="font-semibold text-green-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!item.available}
                        onClick={() => addToCart(item)}
                        className="ml-4"
                      >
                        Agregar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Mesas del Restaurante */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Estado de Mesas</h2>
              <div className="grid grid-cols-3 gap-4">
                {tables.map(table => (
                  <div 
                    key={table.id} 
                    className={`p-4 rounded-lg text-center 
                      ${table.status === 'available' 
                        ? 'bg-green-100 border-green-300' 
                        : 'bg-red-100 border-red-300'
                      } border`}
                  >
                    <div className="text-lg font-bold">Mesa {table.number}</div>
                    <div className={`mt-2 
                      ${table.status === 'available' 
                        ? 'text-green-700' 
                        : 'text-red-700'
                      }`}>
                      {table.status === 'available' ? '🟢 Libre' : '🔴 Ocupada'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Carrito (si está abierto) */}
      {isCartOpen && (
        <div className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-12 object-cover rounded mr-2"
                    />
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-gray-600 ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => removeFromCart(item)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                Continuar al Pago
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Client;