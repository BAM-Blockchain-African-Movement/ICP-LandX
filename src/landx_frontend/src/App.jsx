import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Footer from "./components/footer";
import TerrainManagement from './pages/TerrainManagement';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import TitreCreation from './pages/TitreCreation';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TitreList from './pages/TitreList';
import TitreDetails from './pages/TitreDetails';
import TitreVerification from './pages/TitreVerification';
import TitreTransfer from './pages/TitreTransfer';
import DocumentList from './pages/DocumentList';
import DocumentUpload from './pages/DocumentUpload';
import LitigeList from './pages/LitigeList';
import LitigeCreation from './pages/LitigeCreation';
import LitigeResolution from './pages/LitigeResolution';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path='/register' element={<AuthPage />} />
              {/* <Route path="/create-titre" element={<TitreCreation/>} /> */}
              <Route path="/dashboard" element={<AdminDashboard/>} />
              <Route path="/terrain-management" element={<TerrainManagement />} />
              <Route path="/dashboard/titres" element={<TitreList />} />
              <Route path="/dashboard/titres/create" element={<TitreCreation />} />
              <Route path="/dashboard/titres/:id/details" element={<TitreDetails />} />
              <Route path="/dashboard/titres/:id/verify" element={<TitreVerification />} />
              <Route path="/dashboard/titres/:id/transfer" element={<TitreTransfer />} />
              <Route path="/dashboard/titres/:titreId/documents" element={<DocumentList />} />
              <Route path="/dashboard/titres/:titreId/documents/upload" element={<DocumentUpload />} />
              <Route path="/dashboard/litiges" element={<LitigeList />} />
              <Route path="/dashboard/litiges/create" element={<LitigeCreation />} />
              <Route path="/dashboard/litiges/:id/resolve" element={<LitigeResolution />} />
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