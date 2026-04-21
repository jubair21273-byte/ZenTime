
export interface FocusSlot {
  id: string;
  label: string;
  startTime: string; // ISO string or HH:mm
  endTime: string;
  days: string[]; // ['Mon', 'Tue', ...]
  blockedApps: string[];
  isActive: boolean;
}

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export const INSTALLED_APPS: AppInfo[] = [
  { id: 'com.instagram.android', name: 'Instagram', icon: 'camera', category: 'Social' },
  { id: 'com.facebook.katana', name: 'Facebook', icon: 'facebook', category: 'Social' },
  { id: 'com.twitter.android', name: 'Twitter', icon: 'twitter', category: 'Social' },
  { id: 'com.zhiliaoapp.musically', name: 'TikTok', icon: 'music', category: 'Social' },
  { id: 'com.google.android.youtube', name: 'YouTube', icon: 'youtube', category: 'Entertainment' },
  { id: 'com.netflix.mediaclient', name: 'Netflix', icon: 'play', category: 'Entertainment' },
  { id: 'com.king.candycrushsaga', name: 'Candy Crush', icon: 'gamepad', category: 'Games' },
];
