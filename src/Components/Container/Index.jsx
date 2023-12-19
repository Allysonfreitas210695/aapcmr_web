import React from 'react';

export default function Container({ children }) {
    return (
        <div
            className='bg-primary'
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    );
}
