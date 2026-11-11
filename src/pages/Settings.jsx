import React, { useState } from 'react';
import { User, Lock, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';

export function Settings() {
  const { user, updateUser, logout } = useAuth();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError('');
    setProfileMsg('');

    if (!name.trim()) {
      setProfileError('Name cannot be empty');
      return;
    }

    try {
      setProfileLoading(true);
      const res = await authService.updateProfile(name.trim());
      updateUser(res.user);
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword(currentPassword, newPassword);
      setPasswordMsg('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-black">Account Settings</h1>
        <p className="text-sm text-brand-secondaryGray mt-0.5">
          Manage your personal profile and account credentials
        </p>
      </div>

      {/* Profile Form */}
      <Card className="p-6 space-y-4">
        <CardHeader
          title="Personal Profile"
          subtitle="Your display name and account email"
        />

        {profileMsg && <Alert type="success" message={profileMsg} onClose={() => setProfileMsg('')} />}
        {profileError && <Alert type="error" message={profileError} onClose={() => setProfileError('')} />}

        <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2 text-sm bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
            />
            <p className="text-[11px] text-brand-secondaryGray mt-1">
              Account email cannot be modified.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={profileLoading} size="sm">
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Form */}
      <Card className="p-6 space-y-4">
        <CardHeader
          title="Security & Password"
          subtitle="Change your login credentials"
        />

        {passwordMsg && <Alert type="success" message={passwordMsg} onClose={() => setPasswordMsg('')} />}
        {passwordError && <Alert type="error" message={passwordError} onClose={() => setPasswordError('')} />}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={passwordLoading} size="sm">
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Session / Logout */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-black">Sign Out</h3>
            <p className="text-xs text-brand-secondaryGray mt-0.5">
              End your active session on this computer
            </p>
          </div>
          <Button onClick={logout} variant="danger" size="sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;

