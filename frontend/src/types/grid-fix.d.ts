import * as React from 'react';
import '@mui/material/Grid';
import { GridProps } from '@mui/material/Grid';

declare module '@mui/material/Grid' {
    export interface GridProps {
        item?: boolean;
        container?: boolean;
        xs?: number | 'auto' | boolean;
        sm?: number | 'auto' | boolean;
        md?: number | 'auto' | boolean;
        lg?: number | 'auto' | boolean;
        xl?: number | 'auto' | boolean;
        spacing?: number | string;
        direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
        justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
        alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
        wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
        component?: React.ElementType;
        children?: React.ReactNode;
    }
} 