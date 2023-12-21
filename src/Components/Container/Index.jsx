import React from 'react';

export default function Container({ children }) {
    return (
        <div
            className='bg-primary'
            style={{
                minHeight: '100vh', // Ajusta a altura mínima para ocupar pelo menos a altura da tela
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{ width: '100%', maxWidth: '900px' }}>
                {children}
            </div>
        </div>
    );
}
