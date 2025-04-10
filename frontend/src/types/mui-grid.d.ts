import '@mui/material/Grid';
import { Theme } from '@mui/material/styles';
import { SystemProps } from '@mui/system';
import { ElementType } from 'react';
import { SxProps } from '@mui/system';

declare module '@mui/material/Grid' {
    interface GridTypeMap {
        props: {
            item?: boolean;
            container?: boolean;
            xs?: number | 'auto' | boolean;
            sm?: number | 'auto' | boolean;
            md?: number | 'auto' | boolean;
            lg?: number | 'auto' | boolean;
            xl?: number | 'auto' | boolean;
            spacing?: number | string;
            sx?: SxProps<Theme>;
        };
    }

    interface GridProps {
        component?: ElementType;
    }
} 