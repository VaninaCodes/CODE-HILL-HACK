import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import CreateEvent from "./pages/CreateEvent";
import EventsPage from "./pages/EventsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* 👇 Agregas tus rutas aquí */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;