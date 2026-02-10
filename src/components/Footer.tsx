import {
  Bot,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    Company: ['About Us', 'Our Team', 'Careers', 'Contact'],
    Resources: ['Documentation', 'API Reference', 'Support', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'],
  };

  return (
    <footer className='border-t border-border bg-card/50 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Brand */}
          <div className='lg:col-span-2'>
            <div className='mb-4 flex items-center gap-2'>
              <div className='bg-gradient-primary shadow-glow rounded-lg p-2'>
                <Bot className='h-5 w-5 text-primary-foreground' />
              </div>
              <span className='to-primary-glow bg-gradient-to-r from-primary bg-clip-text text-lg font-bold text-transparent'>
                AIAS
              </span>
            </div>
            <p className='mb-4 max-w-md text-sm text-muted-foreground'>
              Enterprise AI Sidekick for modern businesses. We build intelligent
              automation solutions that scale with your growth and adapt to your
              needs.
            </p>

            {/* Contact Info */}
            <div className='mb-6 space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4' />
                <a
                  className='transition-colors hover:text-primary'
                  href='mailto:hello@aias.com'
                >
                  hello@aias.com
                </a>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone className='h-4 w-4' />
                <a
                  className='transition-colors hover:text-primary'
                  href='tel:+1-555-AIAS-123'
                >
                  +1 (555) AIAS-123
                </a>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex gap-3'>
              <a
                className='rounded-lg bg-secondary p-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground'
                href='https://github.com/aias-founder'
                rel='noopener noreferrer'
                target='_blank'
                title='GitHub'
              >
                <Github className='h-4 w-4' />
              </a>
              <a
                className='rounded-lg bg-secondary p-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground'
                href='https://linkedin.com/in/aias-founder'
                rel='noopener noreferrer'
                target='_blank'
                title='LinkedIn'
              >
                <Linkedin className='h-4 w-4' />
              </a>
              <a
                className='rounded-lg bg-secondary p-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground'
                href='https://twitter.com/aias_ai'
                rel='noopener noreferrer'
                target='_blank'
                title='Twitter'
              >
                <Twitter className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className='mb-4 font-semibold'>{category}</h4>
              <ul className='space-y-2'>
                {links.map(link => (
                  <li key={link}>
                    <button className='text-left text-sm text-muted-foreground transition-colors hover:text-primary'>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className='flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row'>
          <div className='flex flex-col items-center gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>
              © 2025 AIAS. All rights reserved.
            </p>
            <div className='flex gap-4 text-sm text-muted-foreground'>
              <a
                className='transition-colors hover:text-primary'
                href='/privacy'
              >
                Privacy
              </a>
              <a className='transition-colors hover:text-primary' href='/terms'>
                Terms
              </a>
              <a
                className='transition-colors hover:text-primary'
                href='/cookies'
              >
                Cookies
              </a>
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>
            Built with ❤️ for enterprise excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
