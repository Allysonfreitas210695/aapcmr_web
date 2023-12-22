import React from 'react'
import SidebarItem from '../SidebarItem';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

export default function Sidebar({ routesLink, toggleSidebar, collapsed }) {

    return (
        <aside
            className={`text-light ${collapsed ? 'collapsed' : ''}`}
            style={{
                flex: '0 0 auto',
                width: collapsed ? '50px' : '260px',
                height: '100vh',
                transition: 'width 0.6s ease-in-out',
                position: 'fixed',
                zIndex: 999999,
                background: "#3498db"
            }}
        >
            <div style={{ position: 'absolute', top: '10px', right: '5px' }}>
                <button
                    className="btn btn-link text-light"
                    onClick={toggleSidebar}
                >
                    {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
                </button>
            </div>

            <ul
                className='p-0 d-flex flex-column justify-content-between align-items-start'
                style={{ marginTop: '50px' }}>
                {routesLink.map((route, index) => {
                    return <SidebarItem
                        key={index}
                        name={route?.name}
                        Icon={route?.icon}
                        path={route?.path}
                        collapsed={collapsed}
                    />
                }
                )}
            </ul>
        </aside>
    );
}
