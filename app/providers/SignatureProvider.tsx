'use client';

import { SignProvider } from '../context/signContext';
import { ReactNode } from 'react';

export default function SignatureProvider({ children }: { children: ReactNode }) {

    return (
        <SignProvider>

            {children}

        </SignProvider>
    );
}
