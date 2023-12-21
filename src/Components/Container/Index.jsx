import React from 'react';

export default function Container({ children }) {
    return (
        <div
            className='bg-primary'
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: "linear-gradient(rgba(52, 152, 219, 0.5), rgba(52, 152, 219, 0.5)), url('/images/Logo_AAPCMR.jpg')", // Gradiente com a cor #3498db
                backgroundSize: 'cover',
                backgroundRepeat: 'repeat', // Repete a imagem de fundo
            }}
        >
            <div className="background-animation" />
            <div style={{ width: '100%', maxWidth: '900px' }}>
                {children}
            </div>
        </div>
    );
}
