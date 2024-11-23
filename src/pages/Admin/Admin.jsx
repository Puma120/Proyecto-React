import React, { useState } from 'react';
import { Menu, Bell, Users, Settings, Home, Coffee, ClipboardList, CreditCard } from 'lucide-react';
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos Mock
const menuCategories = [
    { id: 1, name: 'Entradas' },
    { id: 2, name: 'Platos Fuertes' },
    { id: 3, name: 'Postres' },
    { id: 4, name: 'Bebidas' }
  ];
  
  const menuItems = [
    { id: 1, category: 1, name: 'Nachos', description: 'Nachos con queso y jalapeños', price: 120, available: true },
    { id: 5, category: 1, name: 'Guacamole', description: 'Guacamole fresco con totopos', price: 80, available: true }
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

const pastOrders = [
    { id: 1, name: 'Pedido 1', total: 350 },
    { id: 2, name: 'Pedido 2', total: 200 }
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
          <p className="text-3xl font-bold">8/15</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const MenuView = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión del Menú</h2>
        <Button>Agregar Producto</Button>
      </div>
      <div className="flex space-x-4">
        {menuCategories.map(category => (
          <Button 
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems
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
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button variant={item.available ? "destructive" : "default"} size="sm">
                      {item.available ? 'Marcar Agotado' : 'Disponible'}
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

const TablesView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Gestión de Mesas</h2>
      <Button>Agregar Mesa</Button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map(table => (
        <Card key={table.id}>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Mesa {table.number}</h3>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm ${
                table.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {table.status === 'available' ? 'Disponible' : 'Ocupada'}
              </div>
              <div className="mt-4 space-x-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button 
                  variant={table.status === 'available' ? 'default' : 'destructive'} 
                  size="sm"
                >
                  {table.status === 'available' ? 'Marcar Ocupada' : 'Liberar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const OrdersView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pedidos Pasados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>{order.name}</CardTitle>
              <CardDescription>Total del Pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">${order.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const PaymentsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Métodos de Pago</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(method => (
          <Card key={method.id}>
            <CardHeader>
              <CardTitle>{method.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const SettingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Rol: {user.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
  
 

    const AdminDashboard = () => {
        const [currentView, setCurrentView] = useState('dashboard');
      
        const renderView = () => {
          switch(currentView) {
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
    { id: 'settings', icon: Settings, label: 'Configuración' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="flex">
        <aside className="w-64 bg-white h-screen shadow-sm border-r p-4">
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-100 cursor-pointer ${
                    currentView === item.id ? 'bg-gray-100' : ''
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

        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
