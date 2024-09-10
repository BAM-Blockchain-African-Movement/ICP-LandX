import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Footer from "./components/footer";
import TerrainManagement from './pages/TerrainManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/terrain-management" element={<TerrainManagement />} />
              {/* Ajoutez d'autres routes ici */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;