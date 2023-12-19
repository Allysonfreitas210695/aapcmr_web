import React from 'react'

export default function Content({ children }) {
    return (
        <div
            style={{
                width: "900px",
                background: "#FFF",
            }}
            className='shadow-lg p-3 bg-white rounded'
        >
            {children}
        </div>
    )
}
