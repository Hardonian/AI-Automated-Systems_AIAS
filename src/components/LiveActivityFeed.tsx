import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const activities = [
  { icon: Zap, text: 'Customer support workflow automated', value: '+32%' },
  { icon: TrendingUp, text: 'Data processing pipeline optimized', value: '2.4x faster' },
  { icon: Activity, text: 'Invoice automation deployed', value: '15 hrs saved/week' },
  { icon: Zap, text: 'Lead qualification agent active', value: '94% accuracy' },
  { icon: TrendingUp, text: 'Report generation automated', value: '8 hrs saved/month' },
];

export const LiveActivityFeed = () => {
  const [activeWorkflows, setActiveWorkflows] = useState(42);
  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflows(prev => prev + Math.floor(Math.random() * 3));
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.8 }}
    >
      <div className="bg-gradient-card backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-card overflow-hidden">
        {/* Animated background pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-4">
          {/* Live counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                className="w-2 h-2 bg-green-500 rounded-full"
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-muted-foreground">Live Activity</span>
            </div>
            <motion.div
              key={activeWorkflows}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent"
              initial={{ scale: 1.2, opacity: 0 }}
            >
              {activeWorkflows}
            </motion.div>
          </div>

          <div className="text-xs text-muted-foreground">
            Active automations this week
          </div>

          {/* Activity stream */}
          <motion.div
            key={currentActivity}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-start gap-3 pt-4 border-t border-border"
            exit={{ x: -20, opacity: 0 }}
            initial={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <activity.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/80 line-clamp-2">{activity.text}</p>
              <p className="text-xs text-accent font-semibold mt-1">{activity.value}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
