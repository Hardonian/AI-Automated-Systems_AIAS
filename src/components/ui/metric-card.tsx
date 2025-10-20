import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    period: string;
  };
}

export function MetricCard({
  title,
  value,
  change,
  description,
  icon,
  className,
  trend,
}: MetricCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600 bg-green-50';
      case 'decrease':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card className={cn('p-6', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change && (
          <div className="flex items-center mt-2">
            <Badge
              variant="secondary"
              className={cn('text-xs', getChangeColor(change.type))}
            >
              {getChangeIcon(change.type)} {Math.abs(change.value)}%
            </Badge>
            {trend && (
              <span className="text-xs text-muted-foreground ml-2">
                vs {trend.period}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}