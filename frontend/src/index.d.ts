import * as React from 'react';
import { ElementType } from 'react';

// Global fixes for Material UI components
declare module '@mui/material/Grid' {
    export interface GridProps {
        component?: ElementType;
        container?: boolean;
        item?: boolean;
        xs?: number | 'auto' | boolean;
        sm?: number | 'auto' | boolean;
        md?: number | 'auto' | boolean;
        lg?: number | 'auto' | boolean;
        xl?: number | 'auto' | boolean;
    }
}

declare module '@mui/material/Alert' {
    export interface AlertProps {
        children?: React.ReactNode;
    }
} 