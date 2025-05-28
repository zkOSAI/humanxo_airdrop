// context/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AirdropContextType = {
  airdrop: string;
  setAirdrop: (airdrop: string) => void;
};

const AirdropContext = createContext<AirdropContextType | undefined>(undefined);

export function AirdropProvider({ children }: { children: ReactNode }) {
  const [airdrop, setAirdrop] = useState("");

  return (
    <AirdropContext.Provider value={{ airdrop, setAirdrop }}>
      {children}
    </AirdropContext.Provider>
  );
}

export function useAirdrop() {
  const context = useContext(AirdropContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
