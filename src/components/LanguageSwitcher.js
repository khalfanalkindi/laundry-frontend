import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', lng);
    };

    return (
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <span 
                onClick={() => changeLanguage('en')}
                style={{
                    cursor: 'pointer',
                    fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                    color: i18n.language === 'en' ? '#00BCD4' : 'black'
                }}
            >
                English
            </span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span 
                onClick={() => changeLanguage('ar')}
                style={{
                    cursor: 'pointer',
                    fontWeight: i18n.language === 'ar' ? 'bold' : 'normal',
                    color: i18n.language === 'ar' ? '#00BCD4' : 'black'
                }}
            >
                العربية
            </span>
        </div>
    );
}

export default LanguageSwitcher;
