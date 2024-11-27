import React, { useEffect, useState } from 'react';
import { Menu, Bell, Users, Settings, Home, Coffee, ClipboardList, CreditCard, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { obtainMenu, createMenuItem, obtainTables, obtainCategories, updateItem, deleteItem, availableItems, createTable, tableStatus, obtainOrders, createUser, obtainKitchenUsers } from '../../services/admin';


// useEffect(() => {
//   const fetchItems = async () => {
//     const querySnapshot = await getDocs(collection(db, "menuItems"));
//     const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setItems(data);
//   };
//   fetchItems();
// }, []);

// Datos Mock
const menuCategories = [
  { id: 1, name: 'Entradas' },
  { id: 2, name: 'Platos Fuertes' },
  { id: 3, name: 'Postres' },
  { id: 4, name: 'Bebidas' }
];

const tables = [
  { id: 1, number: 1, status: 'available' },
  { id: 2, number: 2, status: 'occupied' }
];

const users = [
  { id: 1, name: 'Pablo', role: 'Admin' },
  { id: 2, name: 'Luis', role: 'Cliente' },
  { id: 3, name: 'Ana', role: 'Cocina' }
];


const paymentMethods = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta de Crédito' }
];



const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Activos</CardTitle>
          <CardDescription>Pedidos en proceso actual</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">12</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ventas del Día</CardTitle>
          <CardDescription>Total de ventas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$2,458</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mesas Ocupadas</CardTitle>
          <CardDescription>Estado actual del restaurante</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1/8</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const MenuView = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  // Estado para modo edición
  const [editItemId, setEditItemId] = useState(null); // ID del item a editar

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    image: ""
  });

  const createItem = async () => {
    try {
      const result = await createMenuItem(newMenuItem);
      if (result.id) {
        setMenuItems([...menuItems, { id: result.id, ...newMenuItem }]);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const updateMenuItem = async () => {
    try {
      const result = await updateItem(editItemId, newMenuItem);  // Función para actualizar el item
      if (result) {
        const updatedMenuItems = menuItems.map(item =>
          item.id === editItemId ? { ...item, ...newMenuItem } : item
        );
        setMenuItems(updatedMenuItems);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const resetForm = () => {
    setNewMenuItem({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
      image: ""
    });
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditItemId(null);
  };

  const availableItem = async (itemId, state) => {
    try {
      const result = await availableItems(itemId, state);
      setMenuItems(menuItems.map(item => item.id === itemId ? { ...item, available: result.state } : item));
      if (result.error) {
        console.error("Error updating item:", result.error);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEditClick = (item) => {
    setNewMenuItem({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      image: item.image
    });
    setEditItemId(item.id);
    setIsEditing(true);
    setIsDialogOpen(true);  // Abre el modal en modo edición
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const result = await obtainMenu();
        const categories = await obtainCategories();
        if (result.menu && categories.categories) {
          setMenuItems(result.menu);
          setMenuCategories(categories.categories);
          if (!selectedCategory && categories.categories.length > 0) {
            setSelectedCategory(Number(categories.categories[0].id));
          }
        }
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión del Menú</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Producto</Button>
      </div>

      <div className="flex space-x-4">
        {menuCategories.map(category => (
          <Button
            key={category.id}
            variant="outline"
            className={
              selectedCategory === Number(category.id)
                ? "bg-yellow-400 text-black hover:bg-yellow-400"
                : "border-black text-black hover:bg-gray-100"
            }
            onClick={() => setSelectedCategory(Number(category.id))}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Mostrar loading spinner o mensaje mientras se carga */}
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Cargando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length > 0 &&
            menuItems
              .filter(item => item.category === selectedCategory)
              .map(item => (
                <Card key={item.id}>
                  <CardHeader>
                    <img src={item.image} alt={item.name} className="rounded-lg mb-2" />
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">${item.price}</p>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                          Editar
                        </Button>
                        <Button variant={item.available ? "destructive" : "default"} size="sm" onClick={() => availableItem(item.id, !item.available)}>
                          {item.available ? "Marcar Agotado" : "Marcar Disponible"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      )}

      {/* Modal para agregar/editar producto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar producto" : "Agregar nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input
                id="name"
                value={newMenuItem.name}
                onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={newMenuItem.description}
                onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={newMenuItem.price}
                onChange={e => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                type="number"
                value={newMenuItem.category}
                onChange={e => setNewMenuItem({ ...newMenuItem, category: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="available">Disponible</Label>
              <input
                type="checkbox"
                id="available"
                checked={newMenuItem.available}
                onChange={e => setNewMenuItem({ ...newMenuItem, available: e.target.checked })}
              />
            </div>
            <div>
              <Label htmlFor="image">URL de la imagen</Label>
              <Input
                id="image"
                value={newMenuItem.image}
                onChange={e => setNewMenuItem({ ...newMenuItem, image: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={isEditing ? updateMenuItem : createItem}>
              {isEditing ? "Actualizar" : "Agregar"}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};




const TablesView = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const result = await obtainTables();
      if (result.tables) {
        setTableData(result.tables);
      }
    };
    fetchTables();
  }, []);

  const toggleTableStatus = async (id, status) => {
    const result = await tableStatus(id, status);
    if (result.error) {
      console.error("Error updating table status:", result.error);
    }
    setTableData(tableData.map(table => table.id === id ? { ...table, status: result.status } : table));
  };

  const addTable = async () => {
    const newTable = {
      number: tableData.length + 1,
      status: true
    };
    const result = await createTable(newTable);
    if (result.id) {
      setTableData([...tableData, { id: result.id, ...newTable }]);
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Mesas</h2>
        <Button onClick={addTable}>Agregar Mesa</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tableData.map((table) => (
          <Card key={table.id}>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Mesa {table.number}</h3>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm ${table.status === true
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {table.status === true ? "Disponible" : "Ocupada"}
                </div>
                <div className="mt-4 space-x-2">
                  <Button
                    variant={table.status === true ? "default" : "destructive"}
                    size="sm"
                    onClick={() => toggleTableStatus(table.id, !table.status)}
                  >
                    {table.status === true ? "Marcar Ocupada" : "Liberar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const OrdersView = () => {
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await obtainOrders();
      if (result.orders) {
        // Filtramos las órdenes que tienen el estado "done"
        const doneOrders = result.orders.filter(order => order.state === "done");
        setPastOrders(doneOrders);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pedidos Pasados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardDescription>
                Fecha: {order.created.toDate().toLocaleDateString()} {/* Convertimos el timestamp */}
              </CardDescription>
              <CardTitle className="flex items-center">
                Orden de {order.name}
                <Badge className="ml-2">{`Mesa ${order.mesaId}`}</Badge> {/* Añadimos el Badge aquí */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Total del Pedido</CardDescription>
              <p className="text-lg font-bold">${order.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PaymentsView = () => {
  const [paymentData, setPaymentData] = useState(paymentMethods);
  const [newPayment, setNewPayment] = useState("");

  const addPaymentMethod = () => {
    if (newPayment) {
      setPaymentData((prev) => [
        ...prev,
        { id: Date.now(), name: newPayment },
      ]);
      setNewPayment("");
    }
  };

  const removePaymentMethod = (id) => {
    setPaymentData((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Métodos de Pago</h2>
      <div className="flex space-x-4">
        <input
          value={newPayment}
          onChange={(e) => setNewPayment(e.target.value)}
          placeholder="Nuevo método de pago"
          className="border p-2 flex-1"
        />
        <Button onClick={addPaymentMethod}>Agregar</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentData.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <CardTitle>{method.name}</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePaymentMethod(method.id)}
              >
                Eliminar
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsView = () => {
  const [userData, setUserData] = useState([]);
  const [addingUser, setAddingUser] = useState(false); // Estado para manejar la creación de usuario
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await obtainKitchenUsers();
      if (result.users) {
        setUserData(result.users);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async ({ email, name, password }) => {
    try {
      const newUser = await createUser(email, password, name); // Lógica para crear usuario
      if (newUser) {
        setUserData((prevData) => [...prevData, newUser]); // Agregar el nuevo usuario a la lista de usuarios
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
          duration: 3000, // Duración del toast en milisegundos
        });
        setAddingUser(false); // Cerrar el diálogo de agregar usuario
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        duration: 3000, // Duración del toast en milisegundos
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Personal</h2>
        <Button onClick={() => setAddingUser(true)}>Agregar Usuario</Button> {/* Abrimos el dialog para agregar usuario */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Rol: {user.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Dialog para agregar nuevo usuario */}
      {addingUser && (
        <Dialog open={addingUser} onOpenChange={() => setAddingUser(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get("email");
                const name = formData.get("name");
                const password = formData.get("password");

                if (!email || !name || !password) {
                  toast({
                    title: "Error",
                    description: "Todos los campos son obligatorios.",
                    variant: "destructive",
                  });
                  return;
                }

                handleAddUser({ email, name, password });
              }}
            >
              <div className="space-y-4">
                <input
                  name="email"
                  type="email"
                  className="border p-2 w-full"
                  placeholder="Correo electrónico"
                  required
                />
                <input
                  name="name"
                  className="border p-2 w-full"
                  placeholder="Nombre"
                  required
                />
                <input
                  name="password"
                  type="password"
                  className="border p-2 w-full"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <div className="mt-4">
                <Button type="submit">Crear</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return <MenuView />;
      case 'tables':
        return <TablesView />;
      case 'orders':
        return <OrdersView />;
      case 'payments':
        return <PaymentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'menu', icon: Coffee, label: 'Menú' },
    { id: 'tables', icon: Users, label: 'Mesas' },
    { id: 'orders', icon: ClipboardList, label: 'Pedidos' },
    { id: 'payments', icon: CreditCard, label: 'Pagos' },
    { id: 'settings', icon: User, label: 'Personal' }
  ];

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <nav className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-500" />
            <h1 className="text-xl font-bold">DineSpot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-500" />
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </nav>

      <div className="flex h-full">
        <aside className="w-64 bg-white h-full shadow-sm border-r p-4">
          <nav className="space-y-2 h-full">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-100 cursor-pointer ${currentView === item.id ? 'bg-gray-100' : ''
                    }`}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
