import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
    label, 
    icon: Icon, 
    error, 
    className = '', 
    containerClassName = '',
    ...props 
}, ref) => {
    return (
        <div className={`input-group ${containerClassName}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {Icon && <Icon className="input-icon" size={18} />}
                <input
                    ref={ref}
                    className={`modern-input ${error ? 'error' : ''} ${className}`}
                    {...props}
                />
            </div>
            {typeof error === 'string' && error && (
                <span className="input-error-message">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
