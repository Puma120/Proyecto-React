import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Salad } from "lucide-react";
import { obtainMenu, obtainTables, obtainCategories, createOrder } from '../../services/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"


const Client = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const { toast } = useToast();


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

          // Establecer la categoría seleccionada solo si aún no se ha hecho
          if (selectedCategory === null && categories.categories.length > 0) {
            setSelectedCategory(Number(categories.categories[0].id));
          }
        }
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const createNewOrder = async () => {
    if (cart.length === 0 || !selectedTable) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una mesa y agregar productos al carrito',
        variant: 'destructive',
      });
      return;
    } else {
      const order = {
        mesaId: selectedTable,
        items: cart.map(item => item.id),
        total: calculateTotal(),
        state: 'pending',
        created: new Date().toISOString(),
      };

      try {
        const result = await createOrder(order);
        if (result.id) {
          toast({
            title: 'Éxito',
            description: 'Orden creada exitosamente',
          });
          setCart([]);  // Limpiar carrito
          setSelectedTable(null);  // Limpiar mesa seleccionada
        } else {
          toast({
            title: 'Error',
            description: 'Error al crear la orden',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error creating order:', error);
        toast({
          title: 'Error',
          description: 'Error al crear la orden',
          variant: 'destructive',
        });
      }
    }
  };



  const handleLogOut = () => {
    navigate('/');
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    const itemIndex = cart.findIndex(item => item.id === itemToRemove.id);

    if (itemIndex !== -1) {
      const newCart = [...cart];  // Crea una copia del carrito
      newCart.splice(itemIndex, 1);  // Remueve solo una instancia del ítem
      setCart(newCart);  // Actualiza el estado con el nuevo carrito
    }
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
                  selectedCategory === Number(category.id)  // Convertir category.id a número para la comparación
                    ? 'bg-yellow-400 text-black hover:bg-yellow-400'
                    : 'border-black text-black hover:bg-gray-100'
                }
                onClick={() => {
                  const numericCategory = Number(category.id);  // Asegurarse de que sea un número
                  setSelectedCategory(numericCategory);
                }}
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
                    ? menuCategories.find(c => Number(c.id) === Number(selectedCategory))?.name
                    : 'Cargando categorías...'}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="w-10 h-10 border-4 border-t-4 border-yellow-400 border-solid rounded-full animate-spin duration-1000"></svg>
                    <span className="text-gray-600">Cargando...</span>
                  </div>
                ) : (
                  menuItems.length > 0 && menuItems
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
                    ))
                )}
              </div>
            </ScrollArea>


            {/* Mesas del Restaurante */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Estado de Mesas</h2>
              <div className="grid grid-cols-3 gap-4">
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`p-4 rounded-lg text-center cursor-pointer 
                   ${table.status === true
                        ? (selectedTable === table.id
                          ? 'bg-green-300 border-green-400'  // Cambia el color si la mesa está seleccionada
                          : 'bg-green-100 border-green-300')
                        : 'bg-red-100 border-red-300'
                      } border`}
                    onClick={() => setSelectedTable(table.id)}  // Al hacer clic, se guarda el id de la mesa seleccionada
                    disabled={!table.status}  // Si la mesa está ocupada, no se puede seleccionar
                  >
                    <div className="text-lg font-bold">Mesa {table.number}</div>
                    <div className={`mt-2 
                   ${table.status === true
                        ? 'text-green-700'
                        : 'text-red-700'
                      }`}>
                      {table.status === true ? '🟢 Libre' : '🔴 Ocupada'}
                    </div>
                  </button>
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
              {selectedTable ? (
                <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                  <div>
                    <span className="font-semibold">Mesa Seleccionada:</span>
                    <span className="ml-2">Mesa {tables.find(t => t.id === selectedTable)?.number}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  No has seleccionado una mesa
                </div>
              )}
              <div className="max-h-64 overflow-y-auto">
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
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={createNewOrder}>
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