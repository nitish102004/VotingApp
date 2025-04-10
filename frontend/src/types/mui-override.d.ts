import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';

// Override the Grid component completely
declare module '@mui/material' {
  interface GridProps {
    children?: React.ReactNode;
    container?: boolean;
    item?: boolean;
    xs?: number | 'auto' | boolean;
    sm?: number | 'auto' | boolean;
    md?: number | 'auto' | boolean;
    lg?: number | 'auto' | boolean;
    xl?: number | 'auto' | boolean;
    spacing?: number | string | object;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    sx?: SxProps<Theme>;
    component?: React.ElementType;
    key?: string | number;
  }

  interface AlertProps {
    children?: React.ReactNode;
    severity?: 'error' | 'info' | 'success' | 'warning';
    sx?: SxProps<Theme>;
    variant?: 'filled' | 'outlined' | 'standard';
  }
} 