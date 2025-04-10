import { Theme } from '@mui/material/styles';

// This is the crucial declaration that fixes the Grid component errors
declare module '@mui/material/Grid' {
    interface GridTypeMap {
        defaultComponent: undefined; // Make the default component undefined so it's not required
    }
} 