import React, { useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import TotalIncomeReport from './TotalIncomeReport';
import ServicesPopularityReport from './ServicesPopularityReport';
import BillsByDateReport from './BillsByDateReport';
import { useTranslation } from 'react-i18next';

function ReportsPage() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [key, setKey] = useState('total-income');

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            <h2 style={{ marginBottom: '20px'}}>
                {t('reports')}
            </h2>
            <Tabs
                id="reports-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                style={{ padding: '10px' }}
            >
                <Tab eventKey="total-income" title={t('total_income_report')}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <TotalIncomeReport />
                    </div>
                </Tab>
                <Tab eventKey="services-popularity" title={t('services_popularity_report')}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <ServicesPopularityReport />
                    </div>
                </Tab>
                <Tab eventKey="bills-by-date" title={t('bills_by_date_report')}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <BillsByDateReport />
                    </div>
                </Tab>
            </Tabs>

            {/* Custom CSS */}
            <style type="text/css">
                {`
                    .nav-tabs .nav-link {
                        color: #00BCD4;
                        font-weight: bold;
                        background-color: white;
                        border-radius: 5px 5px 0 0;
                    }

                    .nav-tabs .nav-link.active {
                        color: white;
                        background-color: #00BCD4;
                        border-color: #00BCD4 #00BCD4 #fff;
                    }

                    .nav-tabs {
                        border-bottom: none;
                    }
                `}
            </style>
        </Container>
    );
}

export default ReportsPage;
