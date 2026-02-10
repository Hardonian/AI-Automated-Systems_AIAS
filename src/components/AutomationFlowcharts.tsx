import {
  Bot,
  Database,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const workflows = [
  {
    title: 'Customer Onboarding Automation',
    icon: Bot,
    steps: [
      {
        icon: Mail,
        text: 'Customer signs up',
        color: 'bg-blue-500/20 text-blue-500',
      },
      {
        icon: Bot,
        text: 'AI agent sends welcome email',
        color: 'bg-primary/20 text-primary',
      },
      {
        icon: Database,
        text: 'Creates CRM record',
        color: 'bg-purple-500/20 text-purple-500',
      },
      {
        icon: Calendar,
        text: 'Schedules onboarding call',
        color: 'bg-green-500/20 text-green-500',
      },
      {
        icon: FileText,
        text: 'Generates custom documentation',
        color: 'bg-orange-500/20 text-orange-500',
      },
      {
        icon: CheckCircle,
        text: 'Success notification',
        color: 'bg-primary/20 text-primary',
      },
    ],
    savings: '70% time reduction',
    roi: '350% ROI in 6 months',
  },
  {
    title: 'Invoice Processing Workflow',
    icon: FileText,
    steps: [
      {
        icon: Mail,
        text: 'Invoice received via email',
        color: 'bg-blue-500/20 text-blue-500',
      },
      {
        icon: Bot,
        text: 'AI extracts data & validates',
        color: 'bg-primary/20 text-primary',
      },
      {
        icon: Database,
        text: 'Updates accounting system',
        color: 'bg-purple-500/20 text-purple-500',
      },
      {
        icon: Bot,
        text: 'Routes for approval if needed',
        color: 'bg-orange-500/20 text-orange-500',
      },
      {
        icon: CheckCircle,
        text: 'Processes payment',
        color: 'bg-green-500/20 text-green-500',
      },
      {
        icon: Mail,
        text: 'Confirmation sent',
        color: 'bg-primary/20 text-primary',
      },
    ],
    savings: '95% accuracy improvement',
    roi: '$180K annual savings',
  },
  {
    title: 'HR Recruitment Pipeline',
    icon: Calendar,
    steps: [
      {
        icon: Mail,
        text: 'Application received',
        color: 'bg-blue-500/20 text-blue-500',
      },
      {
        icon: Bot,
        text: 'AI screens resume',
        color: 'bg-primary/20 text-primary',
      },
      {
        icon: Calendar,
        text: 'Auto-schedules interviews',
        color: 'bg-green-500/20 text-green-500',
      },
      {
        icon: Bot,
        text: 'Initial assessment interview',
        color: 'bg-purple-500/20 text-purple-500',
      },
      {
        icon: Database,
        text: 'Updates ATS system',
        color: 'bg-orange-500/20 text-orange-500',
      },
      {
        icon: CheckCircle,
        text: 'Routes to hiring manager',
        color: 'bg-primary/20 text-primary',
      },
    ],
    savings: '60% faster hiring',
    roi: '8 FTE hours saved weekly',
  },
];

export const AutomationFlowcharts = () => {
  return (
    <section className='relative bg-gradient-to-b from-background to-card py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl space-y-4 text-center'>
          <h2 className='text-4xl font-bold md:text-5xl'>
            Common Business
            <span className='to-primary-glow mt-2 block bg-gradient-to-r from-primary bg-clip-text text-transparent'>
              Automation Workflows
            </span>
          </h2>
          <p className='text-xl text-muted-foreground'>
            See how AI agents transform repetitive tasks into automated
            intelligence
          </p>
        </div>

        <div className='mx-auto grid max-w-7xl gap-8 lg:grid-cols-3'>
          {workflows.map((workflow, index) => (
            <div
              key={workflow.title}
              className='bg-gradient-card hover:shadow-glow space-y-6 rounded-xl border border-border p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className='flex items-start gap-4'>
                <div className='rounded-lg bg-primary/10 p-3'>
                  <workflow.icon className='h-6 w-6 text-primary' />
                </div>
                <h3 className='flex-1 pt-2 text-xl font-bold'>
                  {workflow.title}
                </h3>
              </div>

              {/* Workflow Steps */}
              <div className='space-y-4'>
                {workflow.steps.map((step, stepIndex) => (
                  <div
                    key={`${workflow.title}-step-${stepIndex}`}
                    className='relative'
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`rounded-lg p-3 ${step.color} flex-shrink-0`}
                      >
                        <step.icon className='h-5 w-5' />
                      </div>
                      <p className='flex-1 text-sm'>{step.text}</p>
                    </div>
                    {stepIndex < workflow.steps.length - 1 && (
                      <div className='my-2 ml-8'>
                        <ArrowRight className='h-4 w-4 text-muted-foreground' />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className='space-y-2 border-t border-border pt-6'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Time Saved:
                  </span>
                  <span className='font-semibold text-primary'>
                    {workflow.savings}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Impact:</span>
                  <span className='font-semibold text-green-500'>
                    {workflow.roi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='mb-4 text-muted-foreground'>
            These are just examples. We design custom workflows for your
            specific business needs.
          </p>
        </div>
      </div>
    </section>
  );
};
