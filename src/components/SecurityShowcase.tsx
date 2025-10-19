/**
 * Security and Compliance Showcase
 * Comprehensive demonstration of enterprise-grade security features
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
  Globe,
  Database,
  Key,
  Fingerprint,
  Server,
  Cloud,
  Cpu,
  BarChart3,
  Clock,
  Users,
  Settings
} from 'lucide-react';

interface SecurityMetrics {
  threatDetection: {
    totalThreats: number;
    threatsBlocked: number;
    falsePositives: number;
    responseTime: number;
  };
  encryption: {
    dataEncrypted: number;
    encryptionStrength: string;
    keyRotation: number;
    complianceLevel: string;
  };
  accessControl: {
    totalUsers: number;
    activeSessions: number;
    failedAttempts: number;
    privilegedAccess: number;
  };
  compliance: {
    gdprScore: number;
    ccpaScore: number;
    soc2Score: number;
    iso27001Score: number;
  };
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  status: 'resolved' | 'investigating' | 'new';
}

export const SecurityShowcase: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = () => {
    // Simulate loading security metrics
    setMetrics({
      threatDetection: {
        totalThreats: 1247,
        threatsBlocked: 1198,
        falsePositives: 12,
        responseTime: 0.3
      },
      encryption: {
        dataEncrypted: 99.8,
        encryptionStrength: 'AES-256-GCM',
        keyRotation: 90,
        complianceLevel: 'Enterprise'
      },
      accessControl: {
        totalUsers: 2847,
        activeSessions: 156,
        failedAttempts: 23,
        privilegedAccess: 12
      },
      compliance: {
        gdprScore: 98,
        ccpaScore: 96,
        soc2Score: 99,
        iso27001Score: 97
      }
    });

    // Simulate recent security events
    setRecentEvents([
      {
        id: 'evt_1',
        timestamp: '2024-01-20T10:30:00Z',
        type: 'Failed Login Attempt',
        severity: 'medium',
        description: 'Multiple failed login attempts detected from IP 192.168.1.100',
        source: 'Authentication System',
        status: 'resolved'
      },
      {
        id: 'evt_2',
        timestamp: '2024-01-20T09:15:00Z',
        type: 'Suspicious Data Access',
        severity: 'high',
        description: 'Unusual data access pattern detected for user account',
        source: 'Access Control System',
        status: 'investigating'
      },
      {
        id: 'evt_3',
        timestamp: '2024-01-20T08:45:00Z',
        type: 'Malware Detection',
        severity: 'critical',
        description: 'Malicious file detected and quarantined',
        source: 'Endpoint Protection',
        status: 'resolved'
      },
      {
        id: 'evt_4',
        timestamp: '2024-01-20T07:30:00Z',
        type: 'Privilege Escalation Attempt',
        severity: 'high',
        description: 'Unauthorized privilege escalation attempt blocked',
        source: 'Identity Management',
        status: 'resolved'
      }
    ]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Enterprise Security & Compliance</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive security framework with advanced threat detection, 
          encryption, and compliance management
        </p>
      </div>

      {/* Security Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Threats Blocked</p>
                  <p className="text-3xl font-bold text-red-900">{metrics.threatDetection.threatsBlocked}</p>
                  <p className="text-sm text-red-700">
                    {((metrics.threatDetection.threatsBlocked / metrics.threatDetection.totalThreats) * 100).toFixed(1)}% success rate
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Data Encrypted</p>
                  <p className="text-3xl font-bold text-blue-900">{metrics.encryption.dataEncrypted}%</p>
                  <p className="text-sm text-blue-700">{metrics.encryption.encryptionStrength}</p>
                </div>
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Sessions</p>
                  <p className="text-3xl font-bold text-green-900">{metrics.accessControl.activeSessions}</p>
                  <p className="text-sm text-green-700">of {metrics.accessControl.totalUsers} users</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Compliance Score</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {Math.round((metrics.compliance.gdprScore + metrics.compliance.ccpaScore + 
                      metrics.compliance.soc2Score + metrics.compliance.iso27001Score) / 4)}
                  </p>
                  <p className="text-sm text-purple-700">Average across standards</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-blue-600" />
                  Security Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Zero-Trust Architecture</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Multi-Factor Authentication</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role-Based Access Control</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network Segmentation</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Intrusion Detection</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>GDPR Compliance</span>
                        <span>{metrics.compliance.gdprScore}%</span>
                      </div>
                      <Progress value={metrics.compliance.gdprScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CCPA Compliance</span>
                        <span>{metrics.compliance.ccpaScore}%</span>
                      </div>
                      <Progress value={metrics.compliance.ccpaScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SOC 2 Type II</span>
                        <span>{metrics.compliance.soc2Score}%</span>
                      </div>
                      <Progress value={metrics.compliance.soc2Score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>ISO 27001</span>
                        <span>{metrics.compliance.iso27001Score}%</span>
                      </div>
                      <Progress value={metrics.compliance.iso27001Score} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  Threat Detection Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI-Powered Analysis</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Behavioral Analytics</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time Monitoring</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Threat Intelligence</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Automated Response</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Detection Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {((metrics.threatDetection.threatsBlocked / metrics.threatDetection.totalThreats) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Detection Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {metrics.threatDetection.responseTime}s
                      </div>
                      <div className="text-sm text-gray-600">Average Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {metrics.threatDetection.falsePositives}
                      </div>
                      <div className="text-sm text-gray-600">False Positives (Last 24h)</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-6 w-6 text-blue-600" />
                  Encryption Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data at Rest</span>
                    <Badge className="bg-green-100 text-green-800">AES-256-GCM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data in Transit</span>
                    <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Key Management</span>
                    <Badge className="bg-green-100 text-green-800">HSM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Perfect Forward Secrecy</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End-to-End Encryption</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-purple-600" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {metrics.encryption.dataEncrypted}%
                      </div>
                      <div className="text-sm text-gray-600">Data Encrypted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {metrics.encryption.keyRotation} days
                      </div>
                      <div className="text-sm text-gray-600">Key Rotation Cycle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {metrics.encryption.complianceLevel}
                      </div>
                      <div className="text-sm text-gray-600">Compliance Level</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  GDPR Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Subject Rights</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Consent Management</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Portability</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Right to Erasure</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Privacy by Design</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-600" />
                  SOC 2 Type II
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Security Controls</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Availability</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidentiality</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Integrity</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Privacy Controls</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  ISO 27001
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Information Security</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Risk Management</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Access Control</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Incident Management</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Continuous Improvement</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-red-600" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {event.severity === 'critical' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {event.severity === 'high' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                        {event.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {event.severity === 'low' && <AlertTriangle className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.type}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()} • {event.source}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityShowcase;