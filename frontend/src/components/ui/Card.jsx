import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    className = '',
    initial = { opacity: 0, y: 20 },
    animate = { opacity: 1, y: 0 },
    transition = { duration: 0.4 },
    ...props
}) => {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={`glass-card ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
