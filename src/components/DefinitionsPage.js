import React, { useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import CustomersPage from './CustomersPage';
import EntitiesPage from './EntitiesPage';
import ServicesPage from './ServicesPage';
import EntitiesServicesMappingPage from './EntitiesServicesMappingPage';
import { useTranslation } from 'react-i18next';

function DefinitionsPage() {
    const { t, i18n } = useTranslation(); // Using translation
    const [key, setKey] = useState('customers');

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            <header style={{ marginBottom: '20px', fontFamily: 'inherit' }}>
                <h2 style={{ marginBottom: '10px' }}>{t('definitions')}</h2> {/* Page title */}
                <Tabs
                    id="definitions-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    style={{ padding: '10px' }}
                >
                    <Tab eventKey="customers" title={t('customers')} />
                    <Tab eventKey="entities" title={t('entities')} />
                    <Tab eventKey="services" title={t('services')} />
                    <Tab eventKey="entities-services-mapping" title={t('entities_services_mapping')} />
                </Tabs>
            </header>

            <section>
                {key === 'customers' && (
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <CustomersPage />
                    </div>
                )}
                {key === 'entities' && (
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <EntitiesPage />
                    </div>
                )}
                {key === 'services' && (
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <ServicesPage />
                    </div>
                )}
                {key === 'entities-services-mapping' && (
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <EntitiesServicesMappingPage />
                    </div>
                )}
            </section>

            {/* Custom CSS */}
            <style type="text/css">
                {`
                    .nav-tabs .nav-link {
                        color: #00BCD4; /* Non-active tab color */
                        font-weight: bold;
                        background-color: white; /* Background for non-active tabs */
                        border-radius: 5px 5px 0 0; /* Rounded corners for tabs */
                        font-family: ${i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'};
                    }

                    .nav-tabs .nav-link.active {
                        color: white; /* Active tab text color */
                        background-color: #00BCD4; /* Active tab background color */
                        border-color: #00BCD4 #00BCD4 #fff; /* Border for active tab */
                        font-family: ${i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'};
                    }

                    .nav-tabs {
                        border-bottom: none; /* Remove the bottom border of the tab container */
                    }
                `}
            </style>
        </Container>
    );
}

export default DefinitionsPage;
