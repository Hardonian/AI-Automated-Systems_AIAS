"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button"; // Will be used for save actions
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger } from "@/lib/logging/structured-logger";
import { createClient } from "@/lib/supabase/client";
interface UserSettings {
  id: string;
  user_id: string;
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  sms_notifications_enabled: boolean;
  notification_types: Record<string, boolean>;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  date_format: string;
  time_format: "12h" | "24h";
  profile_visibility: "public" | "private" | "friends";
  analytics_opt_in: boolean;
  data_sharing_enabled: boolean;
  beta_features_enabled: boolean;
  experimental_features_enabled: boolean;
  custom_settings: Record<string, unknown>;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<UserSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const data = await response.json();
      setSettings(data.settings || {});
    } catch (error) {
      logger.error("Error loading settings", error instanceof Error ? error : new Error(String(error)), {
        component: "SettingsPage",
        action: "loadSettings",
      });
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<UserSettings>) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();
      setSettings(data.settings || {});
      toast.success("Settings saved successfully");
    } catch (error) {
      logger.error("Error saving settings", error instanceof Error ? error : new Error(String(error)), {
        component: "SettingsPage",
        action: "saveSettings",
      });
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const updates = { ...settings, [key]: value };
    setSettings(updates);
    saveSettings(updates);
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-4xl px-4">
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Settings</h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Manage your account preferences and notification settings
        </p>
      </div>

      <Tabs className="space-y-6" defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent className="space-y-6" value="notifications">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl mb-2">Notification Preferences</CardTitle>
              <CardDescription className="text-base">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.email_notifications_enabled ?? true}
                  disabled={saving}
                  id="email-notifications"
                  onCheckedChange={(checked) =>
                    updateSetting("email_notifications_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.push_notifications_enabled ?? true}
                  disabled={saving}
                  id="push-notifications"
                  onCheckedChange={(checked) =>
                    updateSetting("push_notifications_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive notifications via SMS (requires phone number)
                  </p>
                </div>
                <Switch
                  checked={settings.sms_notifications_enabled ?? false}
                  disabled={saving}
                  id="sms-notifications"
                  onCheckedChange={(checked) =>
                    updateSetting("sms_notifications_enabled", checked)
                  }
                />
              </div>

              <div className="pt-6 border-t">
                <Label className="mb-4 block text-base">Notification Types</Label>
                <div className="space-y-4">
                  {Object.entries(settings.notification_types || {}).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between py-2">
                      <Label className="capitalize text-base" htmlFor={`notification-${type}`}>
                        {type.replace(/_/g, " ")}
                      </Label>
                      <Switch
                        checked={enabled}
                        disabled={saving}
                        id={`notification-${type}`}
                        onCheckedChange={(checked) => {
                          updateSetting("notification_types", {
                            ...settings.notification_types,
                            [type]: checked,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent className="space-y-6" value="appearance">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl mb-2">Appearance</CardTitle>
              <CardDescription className="text-base">
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-base" htmlFor="theme">Theme</Label>
                <Select
                  disabled={saving}
                  value={settings.theme || "system"}
                  onValueChange={(value) =>
                    updateSetting("theme", value as "light" | "dark" | "system")
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="language">Language</Label>
                <Select
                  disabled={saving}
                  value={settings.language || "en"}
                  onValueChange={(value) => updateSetting("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="timezone">Timezone</Label>
                <Select
                  disabled={saving}
                  value={settings.timezone || "UTC"}
                  onValueChange={(value) => updateSetting("timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/Toronto">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Vancouver">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base" htmlFor="time-format">Time Format</Label>
                <Select
                  disabled={saving}
                  value={settings.time_format || "24h"}
                  onValueChange={(value) =>
                    updateSetting("time_format", value as "12h" | "24h")
                  }
                >
                  <SelectTrigger id="time-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent className="space-y-6" value="privacy">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl mb-2">Privacy Settings</CardTitle>
              <CardDescription className="text-base">
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-base" htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  disabled={saving}
                  value={settings.profile_visibility || "private"}
                  onValueChange={(value) =>
                    updateSetting("profile_visibility", value as "public" | "private" | "friends")
                  }
                >
                  <SelectTrigger id="profile-visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="analytics-opt-in">Analytics</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={settings.analytics_opt_in ?? true}
                  disabled={saving}
                  id="analytics-opt-in"
                  onCheckedChange={(checked) =>
                    updateSetting("analytics_opt_in", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Allow sharing of anonymized data with partners
                  </p>
                </div>
                <Switch
                  checked={settings.data_sharing_enabled ?? false}
                  disabled={saving}
                  id="data-sharing"
                  onCheckedChange={(checked) =>
                    updateSetting("data_sharing_enabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent className="space-y-6" value="features">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl mb-2">Feature Preferences</CardTitle>
              <CardDescription className="text-base">
                Enable experimental and beta features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="beta-features">Beta Features</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enable access to beta features
                  </p>
                </div>
                <Switch
                  checked={settings.beta_features_enabled ?? false}
                  disabled={saving}
                  id="beta-features"
                  onCheckedChange={(checked) =>
                    updateSetting("beta_features_enabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <Label className="text-base" htmlFor="experimental-features">Experimental Features</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enable experimental features (may be unstable)
                  </p>
                </div>
                <Switch
                  checked={settings.experimental_features_enabled ?? false}
                  disabled={saving}
                  id="experimental-features"
                  onCheckedChange={(checked) =>
                    updateSetting("experimental_features_enabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
