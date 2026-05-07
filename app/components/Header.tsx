'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Login' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          MyApp
        </Link>
        <nav className="nav">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
