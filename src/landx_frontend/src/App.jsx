import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './client/Auth/AuthContext';
import AuthPage from './pages/AuthPage';
import Admin from './Admin';
import ClientDashboard from './client/Client';
import Header from './client/components/Header';
import Home from './client/pages/Home';
import Footer from './client/components/footer';

// Import all the components used in Admin routes
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import UserList from './pages/UserList';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/client/*" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
              <Route index element={<><PageTitle title="eCommerce Dashboard" /><ECommerce /></>} />
              <Route path="userAuth" element={<><PageTitle title="User Authentication" /><AuthPage isLogin={true} /></>} />
              <Route path="userList" element={<><PageTitle title="User List" /><UserList /></>} />
              <Route path="calendar" element={<><PageTitle title="Calendar" /><Calendar /></>} />
              <Route path="profile" element={<><PageTitle title="Profile" /><Profile /></>} />
              <Route path="forms/form-elements" element={<><PageTitle title="Form Elements" /><FormElements /></>} />
              <Route path="forms/form-layout" element={<><PageTitle title="Form Layout" /><FormLayout /></>} />
              <Route path="tables" element={<><PageTitle title="Tables" /><Tables /></>} />
              <Route path="settings" element={<><PageTitle title="Settings" /><Settings /></>} />
              <Route path="ui/alerts" element={<><PageTitle title="Alerts" /><Alerts /></>} />
              <Route path="ui/buttons" element={<><PageTitle title="Buttons" /><Buttons /></>} />
              <Route path="auth/signin" element={<><PageTitle title="Signin" /><SignIn /></>} />
              <Route path="auth/signup" element={<><PageTitle title="Signup" /><SignUp /></>} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;