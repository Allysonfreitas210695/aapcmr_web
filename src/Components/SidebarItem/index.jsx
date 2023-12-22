import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import "./index.css";

export default function SidebarItem({ name, Icon, path, collapsed }) {
  const [isAtived, setIsAtived] = useState(false);

  const handleIsAtived= (path) => {
    setIsAtived(path);
  };

  return (
    <NavLink
      to={path}
      onClick={handleIsAtived}
      className={`w-100 d-flex justify-content-between align-items-center p-3 text-white ${isAtived == path ? "active" : ""}`}
      style={{ cursor: "pointer", listStyle: "none", textDecoration: 'none' }}
    >
      {!collapsed ? name : null}
      {Icon && <Icon />}
    </NavLink>
  )
}
