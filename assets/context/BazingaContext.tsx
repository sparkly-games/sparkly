import React, { createContext, useContext, useState } from 'react';

type BazingaContextType = {
  bazinga: boolean;
  toggleBazinga: () => void;
};

const BazingaContext = createContext<BazingaContextType>({
  bazinga: false,
  toggleBazinga: () => {},
});

export const useBazinga = () => useContext(BazingaContext);

export function BazingaProvider({ children }: { children: React.ReactNode }) {
  const [bazinga, setBazinga] = useState(false);

  const toggleBazinga = () => setBazinga(b => !b);

  return (
    <BazingaContext.Provider value={{ bazinga, toggleBazinga }}>
      {children}
    </BazingaContext.Provider>
  );
}
