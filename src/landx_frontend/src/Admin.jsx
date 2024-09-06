import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

import Loader from './common/Loader';
import Layout from './layouts/Layout';

function Admin() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Admin;