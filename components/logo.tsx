import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  href?: string
}

export function Logo({ className, size = 60, href = "/" }: LogoProps) {
  const logoComponent = (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: `${size}px`, height: `${size}px` }}>
      <Image
        src="/kinetic-logo.png"
        alt="Kinetic Logo"
        width={size}
        height={size}
        style={{
          objectFit: "contain",
          objectPosition: "center",
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          aspectRatio: "1/1"
        }}
        priority
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoComponent}
      </Link>
    )
  }

  return logoComponent
}
