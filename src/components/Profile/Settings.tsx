import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  Smartphone,
  Volume2,
  Eye,
  Download,
  Trash2,
  HelpCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      issueUpdates: true,
      weeklyDigest: true,
      communityUpdates: false
    },
    privacy: {
      profileVisible: true,
      locationSharing: true,
      analyticsOptIn: true
    },
    preferences: {
      language: 'en',
      theme: 'system',
      autoLocation: true,
      soundEffects: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    
    toast({
      title: "Setting updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleDataDownload = () => {
    toast({
      title: "Data export initiated",
      description: "You will receive an email with your data within 24 hours.",
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  if (isGuest) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">App preferences</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Limited Settings Access</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to access all settings and personalize your experience.
            </p>
            <Button onClick={() => navigate('/signin')}>
              Sign In Now
            </Button>
          </CardContent>
        </Card>

        {/* Basic Settings for Guests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Basic Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="guest-language">Language</Label>
              <Select value={settings.preferences.language} onValueChange={(value) => handleSettingChange('preferences', 'language', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>
      </div>

      {/* Notifications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive instant notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Get updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.notifications.smsNotifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'smsNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="issue-updates">Issue Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about your reported issues</p>
            </div>
            <Switch
              id="issue-updates"
              checked={settings.notifications.issueUpdates}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'issueUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Weekly summary of community activities</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.notifications.weeklyDigest}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'weeklyDigest', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="community-updates">Community Updates</Label>
              <p className="text-sm text-muted-foreground">News and announcements from your area</p>
            </div>
            <Switch
              id="community-updates"
              checked={settings.notifications.communityUpdates}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'communityUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visible">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
            </div>
            <Switch
              id="profile-visible"
              checked={settings.privacy.profileVisible}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'profileVisible', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-sharing">Location Sharing</Label>
              <p className="text-sm text-muted-foreground">Share your location for better issue reporting</p>
            </div>
            <Switch
              id="location-sharing"
              checked={settings.privacy.locationSharing}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'locationSharing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the app by sharing usage data</p>
            </div>
            <Switch
              id="analytics"
              checked={settings.privacy.analyticsOptIn}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'analyticsOptIn', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>App Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select value={settings.preferences.language} onValueChange={(value) => handleSettingChange('preferences', 'language', value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-location">Auto-detect Location</Label>
              <p className="text-sm text-muted-foreground">Automatically use your current location for issues</p>
            </div>
            <Switch
              id="auto-location"
              checked={settings.preferences.autoLocation}
              onCheckedChange={(checked) => handleSettingChange('preferences', 'autoLocation', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for app interactions</p>
            </div>
            <Switch
              id="sound-effects"
              checked={settings.preferences.soundEffects}
              onCheckedChange={(checked) => handleSettingChange('preferences', 'soundEffects', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Account */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data & Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={handleDataDownload}
            className="w-full justify-start"
          >
            <Download className="mr-2 h-4 w-4" />
            Download My Data
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/help')}
            className="w-full justify-start"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          
          <Separator />
          
          <Button
            variant="outline"
            onClick={handleAccountDeletion}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-card">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          <p>Meri Awaaz v1.0.0</p>
          <p>Government of India Initiative</p>
          <p className="mt-2">
            Made with ❤️ for better civic engagement
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;