/**
 * Workflow List Component
 * Displays and manages workflows
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Play, Settings, Clock } from "lucide-react";
import { WorkflowDefinition } from "@/lib/workflows/dsl";
import Link from "next/link";

interface WorkflowListProps {
  userId: string;
  tenantId?: string;
}

export function WorkflowList({ userId, tenantId }: WorkflowListProps) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, [userId, tenantId]);

  const loadWorkflows = async () => {
    try {
      // Would fetch from API
      // const response = await fetch(`/api/workflows?userId=${userId}`);
      // const data = await response.json();
      // setWorkflows(data.workflows);

      // Mock data for now
      setWorkflows([]);
    } catch (error) {
      console.error("Failed to load workflows", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered workflows to avoid re-filtering on every render
  const filteredWorkflows = useMemo(
    () =>
      workflows.filter(workflow =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [workflows, searchQuery]
  );

  if (loading) {
    return <div className="text-center py-8">Loading workflows...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Manage and execute automation workflows
          </p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredWorkflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No workflows found</p>
            <Button asChild>
              <Link href="/workflows/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Workflow
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {workflow.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{workflow.category}</Badge>
                    <Badge variant={workflow.enabled ? "default" : "outline"}>
                      {workflow.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant="outline">
                      {workflow.trigger.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{workflow.steps.length} steps</span>
                    <span>•</span>
                    <span>v{workflow.version}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/workflows/${workflow.id}/execute`}>
                        <Play className="mr-2 h-4 w-4" />
                        Execute
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/workflows/${workflow.id}/settings`}>
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
