'use client';

import { ThemeProvider } from '../context/themeContext';
import { ReactNode } from 'react';

export default function ThemeToggleMenuProvider({ children }: { children: ReactNode }) {

    return (
        <ThemeProvider>

            {children}

        </ThemeProvider>
    );
}
