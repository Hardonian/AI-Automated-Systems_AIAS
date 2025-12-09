/**
 * Automation Dashboard Component
 * Comprehensive view of backend automation capabilities
 */

import { 
  Bot, 
  Calendar, 
  FileText, 
  PenTool, 
  Users, 
  Zap, 
  BarChart3, 
  Settings,
  // Play,
  // Pause,
  // RotateCcw,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Progress } from '@/components/ui/progress';
import { AutomationWorkflow } from '@/lib/automation';
// import { automationManager, LeadGenerationConfig, AppointmentBookingConfig, NoteTakingConfig, SketchingConfig } from '@/lib/automation';

interface AutomationMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  executionsToday: number;
  successRate: number;
  averageExecutionTime: number;
  aiProcessingTime: number;
  costSavings: number;
}

interface WorkflowExecution {
  id: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  duration: number;
  stepsCompleted: number;
  totalSteps: number;
}

export const AutomationDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [metrics, setMetrics] = useState<AutomationMetrics | null>(null);
  const [recentExecutions, setRecentExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    // Load workflows
    const sampleWorkflows: AutomationWorkflow[] = [
      {
        id: 'wf_1',
        name: 'Intelligent Lead Generation',
        description: 'AI-powered lead capture, qualification, and nurturing',
        trigger: { type: 'webhook', config: {} },
        steps: [],
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        createdBy: 'admin',
        tags: ['lead-generation', 'ai-powered'],
        category: 'lead_generation'
      },
      {
        id: 'wf_2',
        name: 'Smart Appointment Booking',
        description: 'Intelligent scheduling with conflict resolution',
        trigger: { type: 'webhook', config: {} },
        steps: [],
        status: 'active',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
        createdBy: 'admin',
        tags: ['appointment-booking', 'ai-scheduling'],
        category: 'appointment_booking'
      },
      {
        id: 'wf_3',
        name: 'AI Note Taking',
        description: 'Real-time transcription and insight extraction',
        trigger: { type: 'event', config: {} },
        steps: [],
        status: 'active',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
        createdBy: 'admin',
        tags: ['note-taking', 'ai-transcription'],
        category: 'note_taking'
      },
      {
        id: 'wf_4',
        name: 'AI-Enhanced Sketching',
        description: 'Intelligent design assistance and collaboration',
        trigger: { type: 'manual', config: {} },
        steps: [],
        status: 'active',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        createdBy: 'admin',
        tags: ['sketching', 'ai-design'],
        category: 'sketching'
      }
    ];

    setWorkflows(sampleWorkflows);

    // Load metrics
    setMetrics({
      totalWorkflows: 12,
      activeWorkflows: 8,
      executionsToday: 156,
      successRate: 94.2,
      averageExecutionTime: 2.3,
      aiProcessingTime: 1.8,
      costSavings: 12500
    });

    // Load recent executions
    setRecentExecutions([
      {
        id: 'exec_1',
        workflowName: 'Intelligent Lead Generation',
        status: 'completed',
        startTime: '2024-01-20T10:30:00Z',
        duration: 1.2,
        stepsCompleted: 4,
        totalSteps: 4
      },
      {
        id: 'exec_2',
        workflowName: 'Smart Appointment Booking',
        status: 'running',
        startTime: '2024-01-20T10:35:00Z',
        duration: 0.8,
        stepsCompleted: 2,
        totalSteps: 5
      },
      {
        id: 'exec_3',
        workflowName: 'AI Note Taking',
        status: 'completed',
        startTime: '2024-01-20T10:20:00Z',
        duration: 3.1,
        stepsCompleted: 4,
        totalSteps: 4
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All', count: workflows.length },
    { id: 'lead_generation', label: 'Lead Generation', count: workflows.filter(w => w.category === 'lead_generation').length },
    { id: 'appointment_booking', label: 'Appointment Booking', count: workflows.filter(w => w.category === 'appointment_booking').length },
    { id: 'note_taking', label: 'Note Taking', count: workflows.filter(w => w.category === 'note_taking').length },
    { id: 'sketching', label: 'Sketching', count: workflows.filter(w => w.category === 'sketching').length },
    { id: 'admin', label: 'Admin', count: workflows.filter(w => w.category === 'admin').length }
  ];

  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Automation Dashboard</h1>
          <p className="text-gray-600 mt-2">Intelligent backend automation and AI-powered workflows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Bot className="h-5 w-5 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.activeWorkflows}</p>
                  <p className="text-sm text-gray-500">of {metrics.totalWorkflows} total</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Executions Today</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.executionsToday}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from yesterday
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.successRate}%</p>
                  <p className="text-sm text-gray-500">Average execution time: {metrics.averageExecutionTime}s</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-3xl font-bold text-gray-900">${metrics.costSavings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs className="w-full" defaultValue="workflows">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Recent Executions</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="workflows">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                className="flex items-center gap-2"
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
                <Badge className="ml-1" variant="secondary">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map(workflow => (
              <Card key={workflow.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {workflow.category === 'lead_generation' && <Users className="h-6 w-6 text-blue-600" />}
                        {workflow.category === 'appointment_booking' && <Calendar className="h-6 w-6 text-green-600" />}
                        {workflow.category === 'note_taking' && <FileText className="h-6 w-6 text-purple-600" />}
                        {workflow.category === 'sketching' && <PenTool className="h-6 w-6 text-orange-600" />}
                        {workflow.category === 'admin' && <Settings className="h-6 w-6 text-gray-600" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(workflow.status)}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map((tag: string) => (
                        <Badge key={tag} className="text-xs" variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="executions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExecutions.map(execution => (
                  <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getStatusIcon(execution.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{execution.workflowName}</h4>
                        <p className="text-sm text-gray-600">
                          Started: {new Date(execution.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {execution.stepsCompleted}/{execution.totalSteps} steps
                        </p>
                        <p className="text-sm text-gray-600">
                          {execution.duration.toFixed(1)}s
                        </p>
                      </div>
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="ai-features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lead Qualification</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sentiment Analysis</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Content Generation</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Predictive Analytics</span>
                    <Badge className="bg-blue-100 text-blue-800">Beta</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Natural Language Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Real-time Transcription</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Language Detection</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Speaker Identification</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Action Item Extraction</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-6 w-6 text-orange-600" />
                  Design Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auto-layout Generation</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Style Transfer</span>
                    <Badge className="bg-blue-100 text-blue-800">Beta</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Color Palette Generation</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Design Optimization</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Smart Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conflict Resolution</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Optimal Time Suggestions</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resource Optimization</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Travel Time Calculation</span>
                    <Badge className="bg-blue-100 text-blue-800">Beta</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Calendar Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Google Calendar</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Outlook</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Apple Calendar</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Calendly</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  CRM Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Salesforce</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">HubSpot</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pipedrive</span>
                    <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zoho CRM</span>
                    <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Slack</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Microsoft Teams</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zoom</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">WhatsApp Business</span>
                    <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationDashboard;