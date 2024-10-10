import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';
import { FaShopify, FaClipboardCheck, FaWhmcs, FaUser, FaSignOutAlt, FaToolbox, FaFileAlt, FaInfo } from 'react-icons/fa';
import logo from '../assets/images/thelogo.png';

function Sidebar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [activePath, setActivePath] = useState(location.pathname);
    const [username, setUsername] = useState('User');
    const [role, setRole] = useState('');

    useEffect(() => {
        const loggedUsername = localStorage.getItem('username');
        const userRole = localStorage.getItem('role');
        if (loggedUsername) {
            setUsername(loggedUsername);
        }
        if (userRole) {
            setRole(userRole);
        }
    }, []);

    const handleLinkClick = (path) => {
        setActivePath(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className={`sidebar ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
            <Link to="/" className="logo-icon sidebar-icon" data-tooltip={t('home')}>
                <img src={logo} alt="Logo" />
            </Link>

            {['user', 'admin', 'superadmin'].includes(role) && (
                <>
                    <Link to="/CreateOrderPage" className={`sidebar-icon ${activePath === '/CreateOrderPage' ? 'active' : ''}`} data-tooltip={t('new_order')} onClick={() => handleLinkClick('/CreateOrderPage')}>
                        <FaShopify />
                    </Link>
                    <Link to="/PickOrderPage" className={`sidebar-icon ${activePath === '/PickOrderPage' ? 'active' : ''}`} data-tooltip={t('pick_order')} onClick={() => handleLinkClick('/PickOrderPage')}>
                        <FaClipboardCheck />
                    </Link>
                </>
            )}

            {['admin', 'superadmin'].includes(role) && (
                <>
                    <Link to="/DefinitionsPage" className={`sidebar-icon ${activePath === '/DefinitionsPage' ? 'active' : ''}`} data-tooltip={t('definitions')} onClick={() => handleLinkClick('/DefinitionsPage')}>
                        <FaToolbox />
                    </Link>
                    <Link to="/ReportsPage" className={`sidebar-icon ${activePath === '/ReportsPage' ? 'active' : ''}`} data-tooltip={t('reports')} onClick={() => handleLinkClick('/ReportsPage')}>
                        <FaFileAlt />
                    </Link>
                    <Link to="/Administrator" className={`sidebar-icon ${activePath === '/Administrator' ? 'active' : ''}`} data-tooltip={t('administrator')} onClick={() => handleLinkClick('/Administrator')}>
                        <FaWhmcs />
                    </Link>
                </>
            )}

            <div style={{ flexGrow: 1 }}></div>

            <Link to="/profile" className="sidebar-icon" data-tooltip={username} onClick={() => handleLinkClick('/profile')}>
                <FaUser />
            </Link>

            <div className="sidebar-icon" data-tooltip={t('sign_out')} onClick={handleLogout}>
                <FaSignOutAlt />
            </div>

            <div style={{ flexGrow: 1 }}></div>

            <div className="sidebar-icon" data-tooltip={t('built_with')}>
                <FaInfo />
            </div>
        </div>
    );
}

export default Sidebar;
