import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Salad } from "lucide-react";
import { obtainMenu, obtainTables, obtainCategories, obtainPaymentMethods } from '../../services/client';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false); // Estado para abrir el modal de pago
  const [selectedTable, setSelectedTable] = useState(null); // Mesa seleccionada
  const [paymentMethods, setPaymentMethods] = useState([]); // Métodos de pago desde la base de datos
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Método de pago seleccionado
  const [splitCount, setSplitCount] = useState(1); // Número de divisiones de la cuenta (por defecto 1)


  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const result = await obtainMenu();
        const categories = await obtainCategories();
        const tables = await obtainTables();
        if (result.menu && categories.categories && tables.tables) {
          setMenuItems(result.menu);
          setMenuCategories(categories.categories);
          setTables(tables.tables);

          if (!selectedCategory && categories.categories.length > 0) {
            const numericCategory = Number(categories.categories[0].id);
            setSelectedCategory(numericCategory);
          }
        }
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      // Ejemplo de respuesta: [{ id: 1, name: "Tarjeta de Crédito" }, { id: 2, name: "Efectivo" }]
      const methods = await obtainPaymentMethods();
      setPaymentMethods(methods || []);
    };
  
    fetchPaymentMethods();
  }, []);

  const handleLogOut = () => {
    navigate('/');
  };

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

      <div className="fixed top-4 left-4">
        <Salad className="w-12 h-12 bg-[#FFD237] text-black p-2 rounded cursor-pointer" onClick={handleLogOut} />
      </div>

      <Card className="max-w-4xl mx-auto h-[750px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            DineSpot Menu
          </CardTitle>
          <h4 className="text-center text-gray-600"> ¡Bienvenido! ¿Qué deseas ordenar hoy? </h4>
        </CardHeader>
        <CardContent>
          {/* Categorías de Menú */}
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {menuCategories.map(category => (
              <Button
                key={category.id}
                variant="outline"
                className={
                  selectedCategory === Number(category.id)
                    ? 'bg-yellow-400 text-black hover:bg-yellow-400'
                    : 'border-black text-black hover:bg-gray-100'
                }
                onClick={() => setSelectedCategory(Number(category.id))}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lista de Productos */}
            <ScrollArea className="h-[96%]">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {menuCategories.length > 0 && selectedCategory
                    ? menuCategories.find(c => Number(c.id) === selectedCategory)?.name
                    : 'Cargando categorías...'}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="w-10 h-10 border-4 border-t-4 border-yellow-400 border-solid rounded-full animate-spin duration-1000"></svg>
                    <span className="text-gray-600">Cargando...</span>
                  </div>
                ) : (
                  menuItems.filter(item => item.category === selectedCategory)
                    .map(item => (
                      <Card key={item.id} className="hover:bg-gray-50">
                        <CardContent className="p-4 flex items-center">
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
                            <p className="text-gray-600 text-sm">{item.description}</p>
                            <p className="font-semibold text-green-600">${item.price.toFixed(2)}</p>
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
                    ))
                )}
              </div>
            </ScrollArea>

            {/* Mesas del Restaurante */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Estado de Mesas</h2>
              <div className="grid grid-cols-3 gap-4">
                {tables.map(table => (
                  <div
                    key={table.id}
                    className={`p-4 rounded-lg text-center 
                      ${table.status
                        ? 'bg-green-100 border-green-300'
                        : 'bg-red-100 border-red-300'
                      } border`}
                  >
                    <div className="text-lg font-bold">Mesa {table.number}</div>
                    <div className={`mt-2 ${table.status ? 'text-green-700' : 'text-red-700'}`}>
                      {table.status ? '🟢 Libre' : '🔴 Ocupada'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    {/* Modal de Carrito */}
    {isCartOpen && (
      <div className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
        {/* Lógica y contenido del carrito */}
        <Button
          className="w-full mt-4"
          onClick={() => setIsPaymentOpen(true)} // Abrir modal de pago
        >
          Continuar al Pago
        </Button>
      </div>
    )}

    {/* Modal para selección de mesa, método de pago y división */}
    {isPaymentOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Completar Pago</h2>

          {/* Selección de mesa */}
          <div className="mb-4">
            <label className="block mb-2">Selecciona una mesa:</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedTable || ''}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="" disabled>Seleccionar mesa</option>
              {tables.filter(table => table.status).map(table => (
                <option key={table.id} value={table.id}>
                  Mesa {table.number}
                </option>
              ))}
            </select>
          </div>

          {/* Selección de método de pago */}
          <div className="mb-4">
            <label className="block mb-2">Método de Pago:</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedPaymentMethod || ''}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="" disabled>Seleccionar método de pago</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          {/* División de cuenta */}
          <div className="mb-4">
            <label className="block mb-2">Dividir cuenta entre:</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              min="1"
              max="5"
              value={splitCount}
              onChange={(e) => setSplitCount(Math.max(1, Math.min(5, Number(e.target.value))))}
            />
          </div>

          {/* Total dividido */}
          <div className="mb-4 text-center">
            <span className="font-bold">Total por persona:</span> ${ (calculateTotal() / splitCount).toFixed(2) }
          </div>

          {/* Botones */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!selectedTable || !selectedPaymentMethod) {
                  alert("Selecciona una mesa y un método de pago.");
                  return;
                }
                console.log({
                  table: selectedTable,
                  paymentMethod: selectedPaymentMethod,
                  splitCount,
                  total: calculateTotal()
                });
                setIsPaymentOpen(false);
                alert("¡Pago completado!");
              }}
            >
              Confirmar Pago
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Client;
