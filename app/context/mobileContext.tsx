// context/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type MobileContextType = {
  mobileMenu: boolean;
  setMobileMenu: (mobileMenu: boolean) => void;
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <MobileContext.Provider value={{ mobileMenu, setMobileMenu }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
