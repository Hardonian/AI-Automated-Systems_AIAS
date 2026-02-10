import { motion } from 'framer-motion';
import { Brain, Zap, Network } from 'lucide-react';

export const ThinkingPulse = () => {
  return (
    <div className='relative mx-auto h-64 w-full max-w-md'>
      {/* Central brain */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className='relative'>
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1],
            }}
            className='absolute inset-0 rounded-full bg-primary/30 blur-xl'
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className='bg-gradient-primary shadow-glow relative flex h-20 w-20 items-center justify-center rounded-full'>
            <Brain className='h-10 w-10 text-white' />
          </div>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {[0, 1, 2].map(index => {
        const angle = index * 120 * (Math.PI / 180);
        const radius = 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={`orbiting-node-${index}`}
            animate={{
              rotate: 360,
            }}
            className='h-1 w-1'
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.3,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              className='relative'
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.4,
              }}
            >
              {/* Connection line */}
              <motion.div
                animate={{ scaleX: 1 }}
                initial={{ scaleX: 0 }}
                style={{
                  position: 'absolute',
                  width: radius,
                  height: '2px',
                  background:
                    'linear-gradient(90deg, hsl(225 100% 50% / 0.5), transparent)',
                  transformOrigin: 'left',
                  right: '50%',
                  top: '50%',
                }}
                transition={{
                  duration: 1,
                  delay: index * 0.3,
                }}
              />

              {/* Node */}
              <div className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-card shadow-accent'>
                {index === 0 && <Zap className='h-5 w-5 text-accent' />}
                {index === 1 && <Network className='h-5 w-5 text-accent' />}
                {index === 2 && <Zap className='h-5 w-5 text-accent' />}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Pulse waves */}
      {[0, 1, 2].map(index => (
        <motion.div
          key={`wave-${index}`}
          animate={{
            scale: [0, 2],
            opacity: [0.6, 0],
          }}
          className='absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary'
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: index * 1,
          }}
        />
      ))}
    </div>
  );
};
