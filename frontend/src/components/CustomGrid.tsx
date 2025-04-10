import React from 'react';
import { Grid as MuiGrid, Alert as MuiAlert } from '@mui/material';

// Custom Grid component that works around TypeScript errors
export const Grid: React.FC<any> = (props) => {
    return <MuiGrid {...props} />;
};

// Custom Alert component that works around TypeScript errors
export const Alert: React.FC<any> = (props) => {
    return <MuiAlert {...props} />;
}; 