import React from 'react'

export default function Error() {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        height: '100vh'
    };
    const h1Style = {
        color: 'white',
        fontSize: '60px'
    }
    const h2Style = {
        color: 'white',
        fontSize: '50px'
    }
    const spanStyle = {
        color: 'rgb(255, 193, 7)'
    }
    return (
        <>
            <div style={containerStyle} className="error-container" >
                <h1 style={h1Style}> <span style={spanStyle}>Error</span> 404</h1>
                <h2 style={h2Style}>Page Not<span style={spanStyle}> Found ...</span></h2>
            </div>
        </>
    )
}
