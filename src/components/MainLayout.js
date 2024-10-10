import React from 'react';
import Sidebar from './Sidebar'; // Assuming Sidebar is in the same directory

const MainLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px' }}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
