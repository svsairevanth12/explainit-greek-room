"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Mic, 
  Globe,
  Moon,
  Sun,
  Volume2,
  Save,
  Trash2,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = React.useState<any>(null);
  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      push: true,
      progress: true,
      reminders: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      progressVisible: false,
      allowDataCollection: true,
    },
    voice: {
      enabled: true,
      language: "en-US",
      speed: "normal",
      volume: 80,
    },
    learning: {
      difficulty: "medium",
      language: "en",
      studyReminders: true,
      autoPlay: false,
    },
  });

  React.useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem("userSettings", JSON.stringify(settings));
    // Show success message
    console.log("Settings saved!");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and customize your learning experience.
            </p>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="voice">Voice & Audio</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-lg">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue={user?.role || "STUDENT"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Level</Label>
                      <Select defaultValue={user?.grade || "high"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elementary">Elementary</SelectItem>
                          <SelectItem value="middle">Middle School</SelectItem>
                          <SelectItem value="high">High School</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about your learning progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "push", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progress-notifications">Progress Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about learning milestones</p>
                      </div>
                      <Switch
                        id="progress-notifications"
                        checked={settings.notifications.progress}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "progress", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="study-reminders">Study Reminders</Label>
                        <p className="text-sm text-muted-foreground">Daily reminders to practice</p>
                      </div>
                      <Switch
                        id="study-reminders"
                        checked={settings.notifications.reminders}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "reminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Product updates and tips</p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "marketing", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Control your privacy settings and data sharing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="profile-visible">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        id="profile-visible"
                        checked={settings.privacy.profileVisible}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "profileVisible", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progress-visible">Share Progress</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your learning progress</p>
                      </div>
                      <Switch
                        id="progress-visible"
                        checked={settings.privacy.progressVisible}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "progressVisible", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-collection">Analytics & Improvement</Label>
                        <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                      </div>
                      <Switch
                        id="data-collection"
                        checked={settings.privacy.allowDataCollection}
                        onCheckedChange={(checked) => handleSettingChange("privacy", "allowDataCollection", checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Data Management</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Download My Data
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDeleteAccount}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voice & Audio */}
            <TabsContent value="voice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice & Audio Settings
                  </CardTitle>
                  <CardDescription>
                    Configure voice recognition and audio preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="voice-enabled">Voice Features</Label>
                      <p className="text-sm text-muted-foreground">Enable voice commands and conversation</p>
                    </div>
                    <Switch
                      id="voice-enabled"
                      checked={settings.voice.enabled}
                      onCheckedChange={(checked) => handleSettingChange("voice", "enabled", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-language">Voice Language</Label>
                    <Select 
                      value={settings.voice.language}
                      onValueChange={(value) => handleSettingChange("voice", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-speed">Speech Speed</Label>
                    <Select 
                      value={settings.voice.speed}
                      onValueChange={(value) => handleSettingChange("voice", "speed", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume: {settings.voice.volume}%</Label>
                    <input
                      type="range"
                      id="volume"
                      min="0"
                      max="100"
                      value={settings.voice.volume}
                      onChange={(e) => handleSettingChange("voice", "volume", parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Preferences */}
            <TabsContent value="learning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Learning Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your learning experience and difficulty levels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Default Difficulty</Label>
                    <Select 
                      value={settings.learning.difficulty}
                      onValueChange={(value) => handleSettingChange("learning", "difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interface-language">Interface Language</Label>
                    <Select 
                      value={settings.learning.language}
                      onValueChange={(value) => handleSettingChange("learning", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="study-reminders-learning">Study Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
                    </div>
                    <Switch
                      id="study-reminders-learning"
                      checked={settings.learning.studyReminders}
                      onCheckedChange={(checked) => handleSettingChange("learning", "studyReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-play">Auto-play Audio</Label>
                      <p className="text-sm text-muted-foreground">Automatically play pronunciation guides</p>
                    </div>
                    <Switch
                      id="auto-play"
                      checked={settings.learning.autoPlay}
                      onCheckedChange={(checked) => handleSettingChange("learning", "autoPlay", checked)}
                    />
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
