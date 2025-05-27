'use client';

import { MobileProvider } from '../context/mobileContext';
import { ReactNode } from 'react';

export default function MobileMenuProvider({ children }: { children: ReactNode }) {

    return (
        <MobileProvider>

            {children}

        </MobileProvider>
    );
}
