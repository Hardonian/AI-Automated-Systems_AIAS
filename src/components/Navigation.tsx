import { Menu, X, Bot } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Services', href: '/services', isRoute: true },
    { name: 'Platform', href: '/platform', isRoute: true },
    { name: 'Case Studies', href: '/case-studies', isRoute: true },
    { name: 'ROI Calculator', href: '/roi-calculator', isRoute: true },
    { name: 'Automation', href: '/automation', isRoute: true },
    { name: 'Privacy', href: '/privacy', isRoute: true },
    { name: 'Trust', href: '/trust', isRoute: true },
    { name: 'Resources', href: '#resources', isRoute: false },
  ];

  return (
    <nav className='fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='bg-gradient-primary shadow-glow rounded-lg p-2'>
              <Bot className='h-6 w-6 text-primary-foreground' />
            </div>
            <span className='to-primary-glow bg-gradient-to-r from-primary bg-clip-text text-xl font-bold text-transparent'>
              AIAS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            {navLinks.map(link =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                  to={link.href}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                  href={link.href}
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className='hidden items-center gap-4 md:flex'>
            <Link to='/auth'>
              <Button size='sm' variant='ghost'>
                Sign In
              </Button>
            </Link>
            <Link to='/auth'>
              <Button className='bg-gradient-primary shadow-glow' size='sm'>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='p-2 text-foreground md:hidden'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='mt-4 space-y-4 pb-4 md:hidden'>
            {navLinks.map(link =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  className='block text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  className='block text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}
            <div className='flex flex-col gap-2 pt-4'>
              <Link to='/auth' onClick={() => setIsOpen(false)}>
                <Button className='w-full' size='sm' variant='ghost'>
                  Sign In
                </Button>
              </Link>
              <Link to='/auth' onClick={() => setIsOpen(false)}>
                <Button
                  className='bg-gradient-primary shadow-glow w-full'
                  size='sm'
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
