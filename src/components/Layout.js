import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, username }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header username={username} />
            <main className="flex-fill">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
