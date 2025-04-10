import '@mui/material/styles';
import '@mui/material/Typography';
import '@mui/material/Button';
import '@mui/material/Alert';
import { ElementType, ReactNode } from 'react';

// Extend the Theme interface
declare module '@mui/material/styles' {
    interface Theme {
        // You can add custom theme properties here if needed
    }

    interface ThemeOptions {
        // You can add custom theme options here if needed
    }
}

// Fix for MUI Alert component to allow children
declare module '@mui/material/Alert' {
    interface AlertProps {
        children?: ReactNode;
    }
}

// Fix for MUI components that require 'component' prop
declare module '@mui/material/Typography' {
    interface TypographyProps {
        component?: ElementType;
    }
}

declare module '@mui/material/Button' {
    interface ButtonProps {
        component?: ElementType;
    }
}

// Add more component fixes as needed
declare module '@mui/material/Paper' {
    interface PaperProps {
        component?: ElementType;
    }
}

declare module '@mui/material/Card' {
    interface CardProps {
        component?: ElementType;
    }
}

declare module '@mui/material/Box' {
    interface BoxProps {
        component?: ElementType;
    }
}

// Make component prop optional for all MUI components
declare module '@mui/material' {
    interface StandardProps {
        component?: ElementType;
    }
} 