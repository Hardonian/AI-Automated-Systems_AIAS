import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Calculator,
  Clock,
  Zap,
  Database,
  Users,
  Shield,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart,
} from 'lucide-react';
import React, { useState } from 'react';

// import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface BillingMetric {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  currentUsage: number;
  monthlyLimit: number;
  overagePrice: number;
  category: 'compute' | 'storage' | 'api' | 'ai' | 'users';
  icon: React.ReactNode;
}

export interface BillingPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'previous' | 'upcoming';
  totalCost: number;
  baseCost: number;
  overageCost: number;
  metrics: BillingMetric[];
}

export interface BillingProjection {
  currentMonth: number;
  projectedMonth: number;
  projectedYear: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

const mockBillingMetrics: BillingMetric[] = [
  {
    id: 'workflow-executions',
    name: 'Workflow Executions',
    unit: 'execution',
    pricePerUnit: 0.01,
    currentUsage: 7500,
    monthlyLimit: 10000,
    overagePrice: 0.02,
    category: 'compute',
    icon: <Zap className='h-5 w-5' />,
  },
  {
    id: 'api-calls',
    name: 'API Calls',
    unit: 'call',
    pricePerUnit: 0.001,
    currentUsage: 8500,
    monthlyLimit: 10000,
    overagePrice: 0.002,
    category: 'api',
    icon: <Shield className='h-5 w-5' />,
  },
  {
    id: 'storage',
    name: 'Data Storage',
    unit: 'GB',
    pricePerUnit: 0.1,
    currentUsage: 6.2,
    monthlyLimit: 10,
    overagePrice: 0.15,
    category: 'storage',
    icon: <Database className='h-5 w-5' />,
  },
  {
    id: 'ai-processing',
    name: 'AI Processing',
    unit: 'minute',
    pricePerUnit: 0.05,
    currentUsage: 120,
    monthlyLimit: 200,
    overagePrice: 0.08,
    category: 'ai',
    icon: <BarChart3 className='h-5 w-5' />,
  },
  {
    id: 'team-members',
    name: 'Team Members',
    unit: 'user',
    pricePerUnit: 5.0,
    currentUsage: 8,
    monthlyLimit: 10,
    overagePrice: 8.0,
    category: 'users',
    icon: <Users className='h-5 w-5' />,
  },
];

const mockBillingPeriods: BillingPeriod[] = [
  {
    id: '2024-01',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'current',
    totalCost: 127.5,
    baseCost: 99.0,
    overageCost: 28.5,
    metrics: mockBillingMetrics,
  },
  {
    id: '2023-12',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    status: 'previous',
    totalCost: 115.2,
    baseCost: 99.0,
    overageCost: 16.2,
    metrics: mockBillingMetrics.map(m => ({
      ...m,
      currentUsage: m.currentUsage * 0.8,
    })),
  },
  {
    id: '2023-11',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    status: 'previous',
    totalCost: 99.0,
    baseCost: 99.0,
    overageCost: 0.0,
    metrics: mockBillingMetrics.map(m => ({
      ...m,
      currentUsage: m.monthlyLimit * 0.7,
    })),
  },
];

export const UsageBasedBilling: React.FC = () => {
  const [currentPeriod] = useState<BillingPeriod>(() => {
    if (mockBillingPeriods[0]) {
      return mockBillingPeriods[0];
    }
    return {
      id: 'current',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'current' as const,
      totalCost: 0,
      baseCost: 0,
      overageCost: 0,
      metrics: [],
    };
  });
  const [billingProjection] = useState<BillingProjection>({
    currentMonth: 127.5,
    projectedMonth: 145.3,
    projectedYear: 1680.0,
    trend: 'increasing',
    confidence: 85,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateMetricCost = (metric: BillingMetric) => {
    const baseUsage = Math.min(metric.currentUsage, metric.monthlyLimit);
    const overageUsage = Math.max(0, metric.currentUsage - metric.monthlyLimit);

    const baseCost = baseUsage * metric.pricePerUnit;
    const overageCost = overageUsage * metric.overagePrice;

    return {
      baseCost,
      overageCost,
      totalCost: baseCost + overageCost,
    };
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) {
      return 'text-red-600';
    }
    if (percentage >= 90) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className='h-4 w-4 text-red-500' />;
      case 'decreasing':
        return <TrendingUp className='h-4 w-4 rotate-180 text-green-500' />;
      default:
        return <BarChart3 className='h-4 w-4 text-gray-500' />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-2 text-3xl font-bold'>
            <DollarSign className='h-8 w-8' />
            Usage-Based Billing
          </h1>
          <p className='mt-1 text-gray-600'>
            Track usage, monitor costs, and optimize spending
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isRefreshing}
            variant='outline'
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      {/* Current Billing Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Current Month
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(currentPeriod.totalCost)}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-green-500' />
            </div>
            <div className='mt-2'>
              <div className='text-sm text-gray-600'>
                Base: {formatCurrency(currentPeriod.baseCost)} | Overage:{' '}
                {formatCurrency(currentPeriod.overageCost)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Projected Month
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(billingProjection.projectedMonth)}
                </p>
              </div>
              <Calculator className='h-8 w-8 text-blue-500' />
            </div>
            <div className='mt-2'>
              <div className='flex items-center text-sm text-gray-600'>
                {getTrendIcon(billingProjection.trend)}
                <span className='ml-1'>
                  {billingProjection.trend === 'increasing' ? '+' : '-'}
                  {formatCurrency(
                    Math.abs(
                      billingProjection.projectedMonth -
                        billingProjection.currentMonth
                    )
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Projected Year
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(billingProjection.projectedYear)}
                </p>
              </div>
              <Calendar className='h-8 w-8 text-purple-500' />
            </div>
            <div className='mt-2'>
              <div className='text-sm text-gray-600'>
                Confidence: {billingProjection.confidence}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Overage Rate
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  {(
                    (currentPeriod.overageCost / currentPeriod.totalCost) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <AlertTriangle className='h-8 w-8 text-red-500' />
            </div>
            <div className='mt-2'>
              <div className='text-sm text-gray-600'>
                {formatCurrency(currentPeriod.overageCost)} overage
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className='w-full' defaultValue='current'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='current'>Current Usage</TabsTrigger>
          <TabsTrigger value='history'>Billing History</TabsTrigger>
          <TabsTrigger value='projections'>Projections</TabsTrigger>
        </TabsList>

        <TabsContent className='space-y-4' value='current'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Current Month Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {currentPeriod.metrics.map(metric => {
                  const costs = calculateMetricCost(metric);
                  const usagePercentage = getUsagePercentage(
                    metric.currentUsage,
                    metric.monthlyLimit
                  );
                  const isOverLimit = metric.currentUsage > metric.monthlyLimit;

                  return (
                    <div key={metric.id} className='rounded-lg border p-4'>
                      <div className='mb-4 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          {metric.icon}
                          <div>
                            <h4 className='font-semibold'>{metric.name}</h4>
                            <p className='text-sm text-gray-600'>
                              {metric.currentUsage.toLocaleString()}{' '}
                              {metric.unit}s used
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-lg font-bold'>
                            {formatCurrency(costs.totalCost)}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {formatCurrency(metric.pricePerUnit)}/{metric.unit}
                          </div>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Usage</span>
                          <span className={getUsageColor(usagePercentage)}>
                            {metric.currentUsage.toLocaleString()}/
                            {metric.monthlyLimit.toLocaleString()}
                          </span>
                        </div>
                        <Progress className='h-2' value={usagePercentage} />

                        {isOverLimit && (
                          <div className='flex justify-between text-sm text-red-600'>
                            <span>Overage</span>
                            <span>{formatCurrency(costs.overageCost)}</span>
                          </div>
                        )}
                      </div>

                      <div className='mt-3 grid grid-cols-2 gap-4 border-t pt-3 text-sm'>
                        <div>
                          <span className='text-gray-600'>Base Cost:</span>
                          <span className='ml-2 font-medium'>
                            {formatCurrency(costs.baseCost)}
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-600'>Overage Cost:</span>
                          <span className='ml-2 font-medium text-red-600'>
                            {formatCurrency(costs.overageCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className='space-y-4' value='history'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mockBillingPeriods.map(period => (
                  <div key={period.id} className='rounded-lg border p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-semibold'>
                          {formatDate(period.startDate)} -{' '}
                          {formatDate(period.endDate)}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          Base: {formatCurrency(period.baseCost)} | Overage:{' '}
                          {formatCurrency(period.overageCost)}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-xl font-bold'>
                          {formatCurrency(period.totalCost)}
                        </div>
                        <Badge
                          className='mt-1'
                          variant={
                            period.status === 'current' ? 'default' : 'outline'
                          }
                        >
                          {period.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className='space-y-4' value='projections'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='text-center'>
                    <div className='mb-2 text-3xl font-bold text-blue-600'>
                      {billingProjection.trend === 'increasing' ? '+' : '-'}
                      {Math.abs(
                        ((billingProjection.projectedMonth -
                          billingProjection.currentMonth) /
                          billingProjection.currentMonth) *
                          100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className='text-sm text-gray-600'>
                      Month-over-month change
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Current Month:</span>
                      <span className='font-medium'>
                        {formatCurrency(billingProjection.currentMonth)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Projected Month:</span>
                      <span className='font-medium'>
                        {formatCurrency(billingProjection.projectedMonth)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Projected Year:</span>
                      <span className='font-medium'>
                        {formatCurrency(billingProjection.projectedYear)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <PieChart className='h-5 w-5' />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {currentPeriod.metrics.map(metric => {
                    const costs = calculateMetricCost(metric);
                    const percentage =
                      (costs.totalCost / currentPeriod.totalCost) * 100;

                    return (
                      <div
                        key={metric.id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          {metric.icon}
                          <span className='text-sm'>{metric.name}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-20 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-blue-600'
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className='w-16 text-right text-sm font-medium'>
                            {formatCurrency(costs.totalCost)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5' />
                Cost Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 rounded-lg bg-yellow-50 p-3'>
                  <AlertTriangle className='mt-0.5 h-5 w-5 text-yellow-600' />
                  <div>
                    <h4 className='font-semibold text-yellow-800'>
                      High API Usage
                    </h4>
                    <p className='text-sm text-yellow-700'>
                      Consider implementing caching to reduce API calls by up to
                      30%
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-lg bg-blue-50 p-3'>
                  <CheckCircle className='mt-0.5 h-5 w-5 text-blue-600' />
                  <div>
                    <h4 className='font-semibold text-blue-800'>
                      Storage Optimization
                    </h4>
                    <p className='text-sm text-blue-700'>
                      Archive old data to reduce storage costs by $15/month
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-lg bg-green-50 p-3'>
                  <CheckCircle className='mt-0.5 h-5 w-5 text-green-600' />
                  <div>
                    <h4 className='font-semibold text-green-800'>
                      Workflow Efficiency
                    </h4>
                    <p className='text-sm text-green-700'>
                      Optimize workflow schedules to reduce execution costs
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
