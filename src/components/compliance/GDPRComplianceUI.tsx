import {
  Shield,
  FileText,
  Users,
  Settings,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Trash2,
  Edit,
  // Send,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';
import React, { useState } from 'react';

// import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Textarea } from '@/components/ui/textarea';

export interface ConsentSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  performance: boolean;
  social: boolean;
}

export interface DataSubject {
  id: string;
  email: string;
  name: string;
  consentId: string;
  dataCategories: string[];
  processingBasis:
    | 'consent'
    | 'contract'
    | 'legal_obligation'
    | 'vital_interests'
    | 'public_task'
    | 'legitimate_interests';
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'pending' | 'withdrawn';
}

export interface DataSubjectRequest {
  id: string;
  subjectId: string;
  requestType:
    | 'access'
    | 'rectification'
    | 'erasure'
    | 'portability'
    | 'restriction'
    | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedAt: string;
  dueDate: string;
  description: string;
  documents?: string[];
}

export interface ComplianceReport {
  id: string;
  type: 'gdpr' | 'ccpa' | 'soc2' | 'iso27001';
  status: 'compliant' | 'non_compliant' | 'needs_review';
  score: number;
  lastAudit: string;
  nextAudit: string;
  issues: string[];
  recommendations: string[];
}

const mockDataSubjects: DataSubject[] = [
  {
    id: 'ds-001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    consentId: 'consent-001',
    dataCategories: ['personal_info', 'contact_info', 'usage_data'],
    processingBasis: 'consent',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T14:22:00Z',
    status: 'active',
  },
  {
    id: 'ds-002',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    consentId: 'consent-002',
    dataCategories: ['personal_info', 'contact_info', 'marketing_data'],
    processingBasis: 'legitimate_interests',
    createdAt: '2024-01-10T09:15:00Z',
    lastUpdated: '2024-01-18T16:45:00Z',
    status: 'pending',
  },
];

const mockRequests: DataSubjectRequest[] = [
  {
    id: 'req-001',
    subjectId: 'ds-001',
    requestType: 'access',
    status: 'in_progress',
    submittedAt: '2024-01-22T11:00:00Z',
    dueDate: '2024-02-05T11:00:00Z',
    description: 'Request for access to all personal data',
    documents: ['data_export_001.pdf'],
  },
  {
    id: 'req-002',
    subjectId: 'ds-002',
    requestType: 'erasure',
    status: 'pending',
    submittedAt: '2024-01-23T14:30:00Z',
    dueDate: '2024-02-06T14:30:00Z',
    description: 'Request for deletion of personal data',
  },
];

const mockComplianceReports: ComplianceReport[] = [
  {
    id: 'report-001',
    type: 'gdpr',
    status: 'compliant',
    score: 95,
    lastAudit: '2024-01-15T00:00:00Z',
    nextAudit: '2024-04-15T00:00:00Z',
    issues: ['Minor documentation gap in data retention policy'],
    recommendations: [
      'Update data retention documentation',
      'Implement automated consent renewal',
    ],
  },
  {
    id: 'report-002',
    type: 'ccpa',
    status: 'compliant',
    score: 98,
    lastAudit: '2024-01-10T00:00:00Z',
    nextAudit: '2024-04-10T00:00:00Z',
    issues: [],
    recommendations: [
      'Continue current practices',
      'Monitor for regulatory updates',
    ],
  },
];

export const GDPRComplianceUI: React.FC = () => {
  const [dataSubjects] = useState<DataSubject[]>(mockDataSubjects);
  const [requests, setRequests] = useState<DataSubjectRequest[]>(mockRequests);
  const [complianceReports] = useState<ComplianceReport[]>(
    mockComplianceReports
  );
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
    preferences: true,
    performance: false,
    social: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest] = useState<DataSubjectRequest | null>(null);

  const _handleConsentChange = (
    category: keyof ConsentSettings,
    value: boolean
  ) => {
    setConsentSettings(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleRequestStatusChange = (
    requestId: string,
    newStatus: DataSubjectRequest['status']
  ) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <Eye className='h-4 w-4' />;
      case 'rectification':
        return <Edit className='h-4 w-4' />;
      case 'erasure':
        return <Trash2 className='h-4 w-4' />;
      case 'portability':
        return <Download className='h-4 w-4' />;
      case 'restriction':
        return <Shield className='h-4 w-4' />;
      case 'objection':
        return <AlertTriangle className='h-4 w-4' />;
      default:
        return <FileText className='h-4 w-4' />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredSubjects = dataSubjects.filter(
    subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(
    request =>
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-2 text-3xl font-bold'>
            <Shield className='h-8 w-8' />
            GDPR/CCPA Compliance Center
          </h1>
          <p className='mt-1 text-gray-600'>
            Manage data privacy, consent, and compliance requirements
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Export Data
          </Button>
          <Button variant='outline'>
            <Upload className='mr-2 h-4 w-4' />
            Import Data
          </Button>
          <Button>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {complianceReports.map(report => (
          <Card key={report.id}>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  {report.type.toUpperCase()}
                </h3>
                <Badge className={getStatusColor(report.status)}>
                  {report.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className='mb-2 text-3xl font-bold text-blue-600'>
                {report.score}%
              </div>
              <div className='mb-4 text-sm text-gray-600'>
                Last audit: {formatDate(report.lastAudit)}
              </div>
              <div className='text-sm text-gray-600'>
                Next audit: {formatDate(report.nextAudit)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs className='w-full' defaultValue='consent'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='consent'>Consent Management</TabsTrigger>
          <TabsTrigger value='subjects'>Data Subjects</TabsTrigger>
          <TabsTrigger value='requests'>Data Requests</TabsTrigger>
          <TabsTrigger value='reports'>Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent className='space-y-4' value='consent'>
          <Card>
            <CardHeader>
              <CardTitle>Cookie & Consent Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Necessary Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Required for basic website functionality
                    </p>
                  </div>
                  <Switch disabled checked={consentSettings.necessary} />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Functional Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Enable enhanced functionality and personalization
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.functional}
                    onCheckedChange={value =>
                      handleConsentChange('functional', value)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Analytics Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Help us understand how visitors interact with our website
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.analytics}
                    onCheckedChange={value =>
                      handleConsentChange('analytics', value)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Marketing Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Used to track visitors across websites for advertising
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.marketing}
                    onCheckedChange={value =>
                      handleConsentChange('marketing', value)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Preference Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Remember your preferences and settings
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.preferences}
                    onCheckedChange={value =>
                      handleConsentChange('preferences', value)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Performance Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Help us improve website performance and user experience
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.performance}
                    onCheckedChange={value =>
                      handleConsentChange('performance', value)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold'>Social Media Cookies</h4>
                    <p className='text-sm text-gray-600'>
                      Enable social media features and content sharing
                    </p>
                  </div>
                  <Switch
                    checked={consentSettings.social}
                    onCheckedChange={value =>
                      handleConsentChange('social', value)
                    }
                  />
                </div>
              </div>

              <div className='border-t pt-4'>
                <Button className='w-full'>Save Consent Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className='space-y-4' value='subjects'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Data Subjects</CardTitle>
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                    <Input
                      className='w-64 pl-10'
                      placeholder='Search subjects...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant='outline'>
                    <Filter className='mr-2 h-4 w-4' />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {filteredSubjects.map(subject => (
                  <div
                    key={subject.id}
                    className='rounded-lg border p-4 hover:bg-gray-50'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                          <Users className='h-5 w-5 text-blue-600' />
                        </div>
                        <div>
                          <h4 className='font-semibold'>{subject.name}</h4>
                          <p className='text-sm text-gray-600'>
                            {subject.email}
                          </p>
                          <div className='mt-1 flex items-center gap-2'>
                            <Badge className='text-xs' variant='outline'>
                              {subject.processingBasis.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(subject.status)}>
                              {subject.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button size='sm' variant='outline'>
                          <Eye className='mr-2 h-4 w-4' />
                          View Data
                        </Button>
                        <Button size='sm' variant='outline'>
                          <Edit className='mr-2 h-4 w-4' />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className='mt-3 text-sm text-gray-600'>
                      <p>
                        Data Categories: {subject.dataCategories.join(', ')}
                      </p>
                      <p>Last Updated: {formatDate(subject.lastUpdated)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className='space-y-4' value='requests'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Data Subject Requests</CardTitle>
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                    <Input
                      className='w-64 pl-10'
                      placeholder='Search requests...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {filteredRequests.map(request => (
                  <div
                    key={request.id}
                    className='rounded-lg border p-4 hover:bg-gray-50'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3'>
                        {getRequestTypeIcon(request.requestType)}
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <h4 className='font-semibold capitalize'>
                              {request.requestType} Request
                            </h4>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className='mb-2 text-sm text-gray-600'>
                            {request.description}
                          </p>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              Submitted: {formatDate(request.submittedAt)}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              Due: {formatDate(request.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => setSelectedRequest(request)}
                        >
                          View Details
                        </Button>
                        {request.status === 'pending' && (
                          <Button
                            size='sm'
                            onClick={() =>
                              handleRequestStatusChange(
                                request.id,
                                'in_progress'
                              )
                            }
                          >
                            Start Processing
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button
                            size='sm'
                            onClick={() =>
                              handleRequestStatusChange(request.id, 'completed')
                            }
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className='space-y-4' value='reports'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {complianceReports.map(report => (
              <Card key={report.id}>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg'>
                      {report.type.toUpperCase()} Report
                    </CardTitle>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='text-center'>
                    <div className='mb-2 text-3xl font-bold text-blue-600'>
                      {report.score}%
                    </div>
                    <div className='text-sm text-gray-600'>
                      Compliance Score
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-sm font-semibold'>Issues Found:</h4>
                    {report.issues.length > 0 ? (
                      <ul className='space-y-1'>
                        {report.issues.map((issue, index) => (
                          <li
                            key={index}
                            className='flex items-center gap-1 text-sm text-red-600'
                          >
                            <AlertTriangle className='h-3 w-3' />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='flex items-center gap-1 text-sm text-green-600'>
                        <CheckCircle className='h-3 w-3' />
                        No issues found
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-sm font-semibold'>Recommendations:</h4>
                    <ul className='space-y-1'>
                      {report.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className='flex items-center gap-1 text-sm text-gray-600'
                        >
                          <CheckCircle className='h-3 w-3' />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='border-t pt-4'>
                    <Button className='w-full' variant='outline'>
                      <Download className='mr-2 h-4 w-4' />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
