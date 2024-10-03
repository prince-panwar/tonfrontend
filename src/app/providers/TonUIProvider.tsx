// src/components/TonConnectProvider.tsx
'use client';

import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

interface TonConnectProviderProps {
  children: React.ReactNode;
}

const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {


  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/markokhman/func-course-chapter-5-code/master/public/manifest.json">
      {children}
    </TonConnectUIProvider>
  );
};

export default TonConnectProvider;
