"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { PriorityModalProvider } from "./PriorityModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <PriorityModalProvider>{children}</PriorityModalProvider>
    </LanguageProvider>
  );
}
