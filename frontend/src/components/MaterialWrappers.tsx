import React from 'react';
import {
    Grid as MuiGrid,
    Alert as MuiAlert,
    AlertProps as MuiAlertProps,
    GridProps as MuiGridProps
} from '@mui/material';

// Define Props types that work around TypeScript issues
interface SafeGridProps extends Omit<MuiGridProps, 'component'> {
    item?: boolean;
    container?: boolean;
    xs?: number | 'auto' | boolean;
    sm?: number | 'auto' | boolean;
    md?: number | 'auto' | boolean;
    lg?: number | 'auto' | boolean;
    xl?: number | 'auto' | boolean;
    children?: React.ReactNode;
    key?: string | number;
    [key: string]: any; // Allow any other props
}

interface SafeAlertProps extends Omit<MuiAlertProps, 'children'> {
    children?: React.ReactNode;
    severity?: 'error' | 'info' | 'success' | 'warning';
    [key: string]: any; // Allow any other props
}

// Safe Grid component
export const Grid: React.FC<SafeGridProps> = (props) => {
    return <MuiGrid {...props} />;
};

// Safe Alert component
export const Alert: React.FC<SafeAlertProps> = (props) => {
    return <MuiAlert {...props} />;
}; 