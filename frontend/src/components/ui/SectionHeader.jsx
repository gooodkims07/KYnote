import React from 'react';
import './SectionHeader.css';

const SectionHeader = ({ title, subtitle, className = '' }) => {
    return (
        <div className={`section-header ${className}`}>
            <h2 className="header-title">{title}</h2>
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
