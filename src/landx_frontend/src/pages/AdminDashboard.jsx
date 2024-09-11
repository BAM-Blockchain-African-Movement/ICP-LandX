import { useState } from 'react';
import { Link, useRoutes } from 'react-router-dom';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';
import LitigeCreation from './LitigeCreation';
import LitigeList from './LitigeList';
import LitigeResolution from './LitigeResolution';
import TitreCreation from './TitreCreation';
import TitreDetails from './TitreDetails';
import TitreList from './TitreList';
import TitreTransfer from './TitreTransfer';
import TitreVerification from './TitreVerification';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [titresOpen, setTitresOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [litigesOpen, setLitigesOpen] = useState(false);

  const routes = [
    {
      path: '/dashboard/titres',
      element: <TitreList />,
    },
    {
      path: '/dashboard/titres/create',
      element: <TitreCreation />,
    },
    {
      path: '/dashboard/titres/:id/details',
      element: <TitreDetails />,
    },
    {
      path: '/dashboard/titres/:id/verify',
      element: <TitreVerification />,
    },
    {
      path: '/dashboard/titres/:id/transfer',
      element: <TitreTransfer />,
    },
    {
      path: '/dashboard/titres/:titreId/documents',
      element: <DocumentList />,
    },
    {
      path: '/dashboard/titres/:titreId/documents/upload',
      element: <DocumentUpload />,
    },
    {
      path: '/dashboard/litiges',
      element: <LitigeList />,
    },
    {
      path: '/dashboard/litiges/create',
      element: <LitigeCreation />,
    },
    {
      path: '/dashboard/litiges/:id/resolve',
      element: <LitigeResolution />,
    }
  ];

  const routing = useRoutes(routes);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <div>
            <button
              onClick={() => setTitresOpen(!titresOpen)}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 flex justify-between items-center"
            >
              Gestion des Titres
              <span className="ml-2">{titresOpen ? '▲' : '▼'}</span>
            </button>
            {titresOpen && (
              <div className="ml-4 space-y-2">
                <Link to="/dashboard/titres" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Liste des Titres
                </Link>
                <Link to="/dashboard/titres/create" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Ajouter un Titre
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setDocumentsOpen(!documentsOpen)}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 flex justify-between items-center"
            >
              Gestion des Documents
              <span className="ml-2">{documentsOpen ? '▲' : '▼'}</span>
            </button>
            {documentsOpen && (
              <div className="ml-4 space-y-2">
                <Link to="/dashboard/titres/documents" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Liste des Documents
                </Link>
                <Link to="/dashboard/titres/documents/upload" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Ajouter un Document
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setLitigesOpen(!litigesOpen)}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 flex justify-between items-center"
            >
              Gestion des Litiges
              <span className="ml-2">{litigesOpen ? '▲' : '▼'}</span>
            </button>
            {litigesOpen && (
              <div className="ml-4 space-y-2">
                <Link to="/dashboard/litiges" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Liste des Litiges
                </Link>
                <Link to="/dashboard/litiges/create" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                  Créer un Litige
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            Menu
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {routing}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
