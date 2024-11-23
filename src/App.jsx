// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './pages/LogIn/LogIn';
import Client from './pages/Client/Client';
import Kitchen from './pages/Kitchen/kitchen';
import Admin from './pages/Admin/Admin';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/client" element={<Client />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
