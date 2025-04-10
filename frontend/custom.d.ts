// For Material UI components
import '@mui/material/Grid';
import '@mui/material/Alert';
import { ElementType, ReactNode } from 'react';

declare module '@mui/material/Grid' {
    interface GridProps {
        component?: ElementType<any>;
        children?: ReactNode;
        item?: boolean;
        container?: boolean;
        xs?: any;
        sm?: any;
        md?: any;
        lg?: any;
        xl?: any;
        spacing?: any;
        direction?: any;
        justifyContent?: any;
        alignItems?: any;
        key?: string | number;
    }
}

declare module '@mui/material/Alert' {
    interface AlertProps {
        component?: ElementType<any>;
        children?: ReactNode;
        severity?: 'error' | 'info' | 'success' | 'warning';
        variant?: 'filled' | 'outlined' | 'standard';
        key?: string | number;
    }
} 