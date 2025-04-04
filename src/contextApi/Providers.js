"use client";

import {HeroUIProvider} from '@heroui/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function Providers({children}) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="syatem" enableSystem={true} themes={['light', 'dark', 'system']}>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}