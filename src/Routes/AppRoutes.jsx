// AppRoutes.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

//Components
import PrivateRoute from './PrivateRoute';

//Context
import { useAuth } from '../Context/useAuth';
import Loading from '../Components/Loading';

const AppRoutes = () => {
  const { loding } = useAuth();
  return (
    <>
      {loding && <Loading />}
      <Router>
        <PrivateRoute />
      </Router>
    </>
  );
};

export default AppRoutes;
