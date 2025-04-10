import * as React from 'react';
import { 
  GridProps as MuiGridProps, 
  GridTypeMap as MuiGridTypeMap 
} from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material/styles';

declare module '@mui/material/Grid' {
  // Augment the GridProps interface to include the missing properties
  export interface GridProps extends MuiGridProps {
    container?: boolean;
    item?: boolean;
    xs?: number | 'auto' | boolean;
    sm?: number | 'auto' | boolean;
    md?: number | 'auto' | boolean;
    lg?: number | 'auto' | boolean;
    xl?: number | 'auto' | boolean;
    spacing?: number | string;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    component?: React.ElementType;
    sx?: SxProps<Theme>;
  }
}

// For other component types, add them here:
declare module '@mui/material' {
  export interface CommonProps {
    component?: React.ElementType;
  }
} 