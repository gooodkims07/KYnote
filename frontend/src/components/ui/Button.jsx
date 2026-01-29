import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary', // primary, secondary, danger, etc.
    className = '',
    icon: Icon,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`modern-btn btn-${variant} ${className}`}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </motion.button>
    );
};

export default Button;
