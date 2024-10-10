import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './HomePage';
import CreateOrderPage from './CreateOrderPage';
import PickOrderPage from './PickOrderPage';
import DefinitionsPage from './DefinitionsPage';
import CustomersPage from './CustomersPage';
import EntitiesPage from './EntitiesPage';
import ServicesPage from './ServicesPage';
import EntitiesServicesMappingPage from './EntitiesServicesMappingPage';
import ReportsPage from './ReportsPage';
import UsersPage from './UsersPage';
import ProfilePage from './ProfilePage';
import TestSamplePage from './TestSamplePage';

const MainContent = () => {
    const { i18n } = useTranslation();

    const mainContentStyle = {
        padding: '10px',
        marginLeft: i18n.language === 'ar' ? '0' : '5.5rem',
        marginRight: i18n.language === 'ar' ? '5.5rem' : '0',
    };

    return (
        <div style={mainContentStyle}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/CreateOrderPage" element={<CreateOrderPage />} />
                <Route path="/PickOrderPage" element={<PickOrderPage />} />
                <Route path="/DefinitionsPage" element={<DefinitionsPage />} />
                <Route path="/EntitiesPage" element={<EntitiesPage />} />
                <Route path="/CustomersPage" element={<CustomersPage />} />
                <Route path="/ServicesPage" element={<ServicesPage />} />
                <Route path="/EntitiesServicesMappingPage" element={<EntitiesServicesMappingPage />} />
                <Route path="/ReportsPage" element={<ReportsPage />} />
                <Route path="/Administrator" element={<UsersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                <Route path="/TestSamplePage" element={<TestSamplePage />} />
            </Routes>
        </div>
    );
};

export default MainContent;
