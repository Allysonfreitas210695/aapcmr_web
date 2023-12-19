import React from 'react'
import { NavLink } from 'react-router-dom'
import "./index.css";

export default function SidebarItem({ name, Icon, path, collapsed }) {
  return (
    <NavLink
      to={path}
      className='w-100 d-flex justify-content-between align-items-center p-3 text-white'
      style={{ cursor: "pointer", listStyle: "none", textDecoration: 'none' }}
    >
      {!collapsed ? name : null}
      {Icon && <Icon />}
    </NavLink>
  )
}
