"use client"

import { useState } from "react"

interface ProviderIconProps {
  name: string
  iconUrl?: string | null
  className?: string
}

export function ProviderIcon({ name, iconUrl, className = "" }: ProviderIconProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = name.slice(0, 2).toUpperCase()

  if (iconUrl && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt={name}
        className={`shrink-0 object-contain ${className}`}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className={`shrink-0 flex items-center justify-center font-bold bg-primary/10 text-primary ${className}`}>
      {initials}
    </div>
  )
}
