import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Award,
  Code,
  Users,
  Building2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const About = () => {
  const founders = [
    {
      name: 'AIAS Founder',
      role: 'Co-Founder & CTO',
      bio: 'Leading AI innovation with 10+ years in enterprise automation and machine learning. Expert in building scalable AI systems that transform business operations.',
      credentials: [
        'AI/ML Engineering Expert',
        'Enterprise Architecture',
        'Automation Specialist',
        'Open Source Contributor',
      ],
      social: {
        github: 'https://github.com/shardie-github/aias',
        linkedin: 'https://linkedin.com/in/aias-founder',
        email: 'inquiries@aiautomatedsystems.ca',
      },
      avatar: '👨‍💻',
    },
    {
      name: 'Nick Morfopos',
      role: 'Co-Founder & CEO',
      bio: 'Strategic visionary with deep expertise in business development and market expansion. Driving AIAS towards becoming the leading AI automation consultancy.',
      credentials: [
        'Business Strategy',
        'Market Development',
        'Operations Leadership',
        'Growth Hacking',
      ],
      social: {
        linkedin: 'https://linkedin.com/in/nickmorfopos',
        email: 'nick@aias.com',
      },
      avatar: '👨‍💼',
    },
  ];

  const companyStats = [
    {
      icon: Building2,
      value: '50+',
      label: 'Enterprise Clients',
      description: 'Fortune 500 companies trust our solutions',
    },
    {
      icon: Code,
      value: '1000+',
      label: 'Automations Built',
      description: 'Custom workflows deployed successfully',
    },
    {
      icon: Users,
      value: '25+',
      label: 'Team Members',
      description: 'AI experts and automation specialists',
    },
    {
      icon: Award,
      value: '99.9%',
      label: 'Client Satisfaction',
      description: 'Based on post-implementation surveys',
    },
  ];

  return (
    <section className='relative overflow-hidden py-24' id='about'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
      <div className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl' />
      <div className='absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl' />

      <div className='container relative z-10 mx-auto px-4'>
        {/* Section Header */}
        <motion.div
          className='mx-auto mb-16 max-w-4xl space-y-4 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='text-4xl font-bold sm:text-5xl md:text-6xl'>
            Meet the
            <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
              Visionary Team
            </span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
            AI pioneers and business strategists working together to
            revolutionize enterprise automation
          </p>
        </motion.div>

        {/* Founders Section */}
        <div className='mb-20 grid gap-8 md:grid-cols-2 lg:gap-12'>
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className='bg-gradient-card group h-full border border-border backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10'>
                <CardContent className='p-8'>
                  <div className='flex flex-col items-center space-y-6 text-center'>
                    {/* Avatar */}
                    <div className='mb-4 text-6xl'>{founder.avatar}</div>

                    {/* Name and Role */}
                    <div>
                      <h3 className='mb-2 text-2xl font-bold'>
                        {founder.name}
                      </h3>
                      <Badge className='px-4 py-1 text-sm' variant='secondary'>
                        {founder.role}
                      </Badge>
                    </div>

                    {/* Bio */}
                    <p className='leading-relaxed text-muted-foreground'>
                      {founder.bio}
                    </p>

                    {/* Credentials */}
                    <div className='w-full'>
                      <h4 className='mb-3 text-center font-semibold'>
                        Key Expertise
                      </h4>
                      <div className='flex flex-wrap justify-center gap-2'>
                        {founder.credentials.map((credential, idx) => (
                          <Badge
                            key={`${founder.name}-credential-${idx}`}
                            className='text-xs'
                            variant='outline'
                          >
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className='flex gap-3 pt-4'>
                      {founder.social.github && (
                        <Button
                          asChild
                          className='transition-colors hover:bg-primary hover:text-primary-foreground'
                          size='sm'
                          variant='outline'
                        >
                          <a
                            href={founder.social.github}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            <Github className='mr-2 h-4 w-4' />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {founder.social.linkedin && (
                        <Button
                          asChild
                          className='transition-colors hover:bg-primary hover:text-primary-foreground'
                          size='sm'
                          variant='outline'
                        >
                          <a
                            href={founder.social.linkedin}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            <Linkedin className='mr-2 h-4 w-4' />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {founder.social.email && (
                        <Button
                          asChild
                          className='transition-colors hover:bg-primary hover:text-primary-foreground'
                          size='sm'
                          variant='outline'
                        >
                          <a href={`mailto:${founder.social.email}`}>
                            <Mail className='mr-2 h-4 w-4' />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Stats */}
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className='mb-12 text-3xl font-bold'>Our Impact in Numbers</h3>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {companyStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className='group'
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:shadow-xl group-hover:border-primary/50'>
                  <CardContent className='p-6 text-center'>
                    <div className='mx-auto mb-4 w-fit rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20'>
                      <stat.icon className='h-6 w-6 text-primary' />
                    </div>
                    <div className='bg-gradient-accent mb-2 bg-clip-text text-3xl font-bold text-transparent'>
                      {stat.value}
                    </div>
                    <div className='mb-1 font-semibold'>{stat.label}</div>
                    <div className='text-sm text-muted-foreground'>
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className='mx-auto max-w-4xl text-center'
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Card className='bg-gradient-card border border-border backdrop-blur-sm'>
            <CardContent className='p-8 lg:p-12'>
              <h3 className='mb-6 text-3xl font-bold'>Our Mission</h3>
              <p className='mb-6 text-lg leading-relaxed text-muted-foreground'>
                To democratize AI automation for enterprises of all sizes,
                making intelligent workflows accessible, reliable, and
                transformative. We believe every business deserves the power of
                AI to scale efficiently and focus on what matters most.
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Badge className='px-4 py-2' variant='secondary'>
                  Innovation First
                </Badge>
                <Badge className='px-4 py-2' variant='secondary'>
                  Client Success
                </Badge>
                <Badge className='px-4 py-2' variant='secondary'>
                  Open Source
                </Badge>
                <Badge className='px-4 py-2' variant='secondary'>
                  Transparency
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
