import React from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navbar />
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                {children}
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
                <Container maxWidth="sm">
                    <Box textAlign="center">
                        Voting Application © {new Date().getFullYear()}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 