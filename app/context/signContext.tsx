'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SignContextType = {
  signature: Uint8Array | null;
  setSignature: (signature: Uint8Array | null) => void;
};

const SignContext = createContext<SignContextType | undefined>(undefined);

export function SignProvider({ children }: { children: ReactNode }) {
  const [signature, setSignature] = useState<Uint8Array | null>(null);

  return (
    <SignContext.Provider value={{ signature, setSignature }}>
      {children}
    </SignContext.Provider>
  );
}

export function useSignature() {
  const context = useContext(SignContext);
  if (!context) throw new Error('useSignature must be used within a SignProvider');
  return context;
}