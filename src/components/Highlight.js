import React from 'react';

export default function Highlight({children, color}) {
    return (
        // <span
        //     style={{
        //         backgroundColor: color,
        //         borderRadius: '15px',
        //         color: '#fff',
        //         padding: '0.3rem 0.7rem 0.3rem 0.7rem',
        //         marginRight: '0.5rem',
        //         marginBottom: '10rem',
        //         fontWeight: 'bold'
        //     }}>
    <span className="badge badge--secondary"
          style={{
              marginRight: '0.3rem', backgroundColor: color, color: '#fff'
          }}>
      {children}
    </span>
    );
}
