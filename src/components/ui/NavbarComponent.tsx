"use client"
import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import clsx from 'clsx'
import {Cookie} from "next/font/google"
const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
})
interface NavButton {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'outline'
  onClick?: () => void
}

const Button: React.FC<NavButton> = ({
  className,
  children,
  variant = 'default',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-4 py-2',
        variant === 'default' && [
          'bg-black text-white hover:bg-black/90',
          'dark:bg-white dark:text-black dark:hover:bg-white/90'
        ],
        variant === 'outline' && [
          'border border-current',
          'hover:bg-black/10 dark:hover:bg-white/10'
        ],
        className
      )}
    >
      {children}
    </button>
  )
}

interface NavItem {
  to?: string
  text: string
  items?: {
    icon?: {
      dark: string
      light: string
    }
    text: string
    description?: string
    to: string
  }[]
}

interface HeaderProps {
  className?: string
  theme?: 'light' | 'dark'
  isSticky?: boolean
  isStickyOverlay?: boolean
  withBorder?: boolean
  logo?: React.ReactNode
  menuItems?: NavItem[]
  onThemeChange?: () => void
  rightContent?: React.ReactNode
}

const ChevronIcon = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-2.5 opacity-60 [&_path]:stroke-2"
  >
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Navigation: React.FC<{ isDarkTheme?: boolean; items: NavItem[] }> = ({ isDarkTheme, items }) => {
  return (
    <nav>
      <ul className=" gap-x-10 xl:gap-x-8 lg:flex hidden [@media(max-width:1070px)]:gap-x-6">
        {items.map(({ to, text, items }, index) => {
          const Tag = to ? 'a' : 'button'
          return (
            <li
              className={clsx('relative ', (items?.length ?? 0) > 0 && 'group')}
              key={index}
            >
              <Tag
                className={clsx(
                  'flex cursor-pointer items-center gap-x-1 whitespace-pre text-md font-semibold relative',
                  isDarkTheme ? 'text-white' : 'text-black dark:text-white',
                  'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full'
                )}
                href={to}
              >
                {text}
                {items && items.length > 0 && <ChevronIcon />}
              </Tag>
              {(items?.length ?? 0) > 0 && (
                <div
                  className={clsx(
                    'absolute -left-5 top-full w-[300px] pt-5',
                    'pointer-events-none opacity-0',
                    'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
                    'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                  )}
                >
                  <ul
                    className={clsx(
                      'relative flex min-w-[248px] flex-col gap-y-0.5 rounded-[14px] border p-2.5',
                      'dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]',
                      isDarkTheme
                        ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                        : 'border-gray-200 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)]'
                    )}
                  >
                    {items && items.map(({ icon, text, description, to }, index) => (
                      <li key={index}>
                        <Link
                          className={clsx(
                            'group/link relative flex items-center overflow-hidden whitespace-nowrap rounded-[14px] p-2',
                            'before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100',
                            isDarkTheme
                              ? 'text-white before:bg-[#16181D]'
                              : 'text-black before:bg-[#f5f5f5]'
                          )}
                          href={to}
                        >
                          {icon && (
                            <div
                              className={clsx(
                                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                                isDarkTheme
                                  ? 'border-[#2E3038] bg-[#16181D]'
                                  : 'border-gray-200 bg-[#F5F5F5]'
                              )}
                            >

                              <Image
                                className="h-5 w-5"
                                src={isDarkTheme ? icon.dark : icon.light}
                                width={20}
                                height={20}
                                loading="lazy"
                                alt=""
                                aria-hidden
                              />

                            </div>
                          )}
                          <div className="relative z-10 ml-3">
                            <span className="block text-sm font-medium">{text}</span>
                            {description && (
                              <span
                                className={clsx(
                                  'mt-0.5 block text-sm',
                                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                )}
                              >
                                {description}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </li>
          )

        })}
      </ul>
    </nav>
  )
}

interface MobileMenuButtonProps {
  onClick: () => void
  isDarkTheme?: boolean
  isOpen?: boolean
}

const MobileMenuButton: React.FC<MobileMenuButtonProps & { menuItems?: NavItem[] }> = ({
  onClick,
  isDarkTheme,
  isOpen = false,
  menuItems = []
}) => {
  return (
    <div className="relative">
      <button
      className={clsx(
        'block lg:hidden',
        'relative h-10 w-10',
        isDarkTheme ? 'text-white' : 'text-black dark:text-white',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-md'
      )}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      type="button"
      >
      {/* Hamburger icon */}
      <span className={clsx(
        'absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 -translate-y-2 rounded-full bg-current transition-all',
        isOpen && 'rotate-45 translate-y-0'
      )} />
      <span className={clsx(
        'absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 -translate-y-0 rounded-full bg-current transition-all',
        isOpen && '-rotate-45 translate-y-0'
      )} />
      <span className={clsx(
        'absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 translate-y-2 rounded-full bg-current transition-all',
        isOpen && 'opacity-0'
      )} />
      </button>

      {isOpen && (
      <div
        id="mobile-menu"
        role="menu"
        aria-label="Main menu"
        tabIndex={-1}
        className={clsx(
        'fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0B0C0F] transition-all duration-200',
        'lg:hidden'
        )}
      >
        <div className="flex justify-end p-4">
        <button
          onClick={onClick}
          aria-label="Close menu"
          className={clsx(
          'h-8 w-8 flex items-center justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
          isDarkTheme ? 'text-white' : 'text-black dark:text-white'
          )}
        >
          <span className="sr-only">Close menu</span>
          <svg width="24" height="24" fill="none" aria-hidden="true">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        </div>
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile">
        <ul className="flex flex-col gap-2 px-6 py-2">
          {menuItems.map((item, index) => (
          <li key={index}>
            <Link
            href={item.to ?? '#'}
            className={clsx(
              'block w-full px-4 py-3 rounded text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
              isDarkTheme ? 'text-white hover:bg-[#16181D]' : 'text-black hover:bg-gray-100'
            )}
            role="menuitem"
            tabIndex={0}
            onClick={onClick}
            >
            {item.text}
            </Link>
            {item.items && item.items.length > 0 && (
            <ul className="ml-4 mt-1 flex flex-col gap-y-1">
              {item.items.map((subItem, subIndex) => (
              <li key={subIndex}>
                <Link
                href={subItem.to}
                className={clsx(
                  'block px-4 py-2 rounded text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
                  isDarkTheme ? 'text-white hover:bg-[#16181D]' : 'text-black hover:bg-gray-100'
                )}
                role="menuitem"
                tabIndex={0}
                onClick={onClick}
                >
                {subItem.text}
                </Link>
              </li>
              ))}
            </ul>
            )}
          </li>
          ))}
        </ul>
        </nav>
      </div>
      )}
    </div>
  )
}


export const Header: React.FC<HeaderProps> = ({
  className,
  theme = 'light',
  isSticky = false,
  isStickyOverlay = false,
  withBorder = false,
  logo,
  menuItems = [],
  onThemeChange,
  rightContent,
}) => {
  console.log(logo)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const isDarkTheme = theme === 'dark'

  return (
    <header
      className={clsx(
        'relative z-40 w-full',
        isSticky && 'sticky top-0',
        isStickyOverlay && 'bg-white/80 backdrop-blur-md dark:bg-[#0B0C0F]/80',
        withBorder && 'border-b border-gray-200 dark:border-[#16181D]',
        !isDarkTheme && 'bg-gradient-to-br from-pink-50  via-fuchsia-50 to-fuchsia-100',
        className
      )}
    >
      <div className="mx-auto max-w-[1760px] px-5 py-4">
        <div className="flex items-center justify-between">
          <Link className="flex justify-center items-center" href="/">
            <h1 className={`font-bold text-5xl py-1 bg-clip-text text-transparent bg-gradient-to-bl from-pink-400 to-pink-600 ${cookie.className}`}>SheSync</h1>
            <span className="text-3xl ml-1">🌸</span>
          </Link>
          <Navigation isDarkTheme={isDarkTheme} items={menuItems} />

          <div className="flex items-center gap-3 md:gap-6">
            {rightContent}

            {onThemeChange && (
              <Button
                variant="default"
                onClick={onThemeChange}
              >
                {isDarkTheme ? '🌞' : '🌙'}
              </Button>
            )}
            <MobileMenuButton
              isDarkTheme={isDarkTheme}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isOpen={isMobileMenuOpen}
              menuItems={menuItems}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export { Button }
export default Header
