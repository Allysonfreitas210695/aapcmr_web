import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

//Conponentes
import Sidebar from '../Components/Sidebar';
import Hearder from '../Components/Hearder';

const AdminLayout = ({ adminRoutes }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        routesLink={adminRoutes?.filter(x => x.sidebar == true) || []}
        toggleSidebar={toggleSidebar}
        collapsed={collapsed}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Hearder />
        <main
          style={{
            marginTop: "60px",
            marginLeft: !collapsed ? "260px" : "60px",
            transition: 'margin-left 0.3s ease-in-out',
            overflowY: 'auto',
            background: "#FFF",
            padding: "5px 25px"
          }}
        >
          <Routes>
            {adminRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
