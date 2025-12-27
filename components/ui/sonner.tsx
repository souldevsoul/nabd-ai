"use client"

import {
  SlCheck,
  SlInfo,
  SlRefresh,
  SlClose,
  SlExclamation,
} from "react-icons/sl"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <SlCheck className="size-4" />,
        info: <SlInfo className="size-4" />,
        warning: <SlExclamation className="size-4" />,
        error: <SlClose className="size-4" />,
        loading: <SlRefresh className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
