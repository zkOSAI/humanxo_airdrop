'use client';

import { AirdropProvider } from '../context/airdropContext';
import { ReactNode } from 'react';

export default function AirdropAmountProvider({ children }: { children: ReactNode }) {

    return (
        <AirdropProvider>

            {children}

        </AirdropProvider>
    );
}
