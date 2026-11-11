import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Topics from '../pages/Topics';
import AddTopic from '../pages/AddTopic';
import TopicDetails from '../pages/TopicDetails';
import RevisionDetails from '../pages/RevisionDetails';
import RevisionHistory from '../pages/RevisionHistory';
import Progress from '../pages/Progress';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Application Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/new" element={<AddTopic />} />
        <Route path="/topics/:id" element={<TopicDetails />} />
        <Route path="/revisions/:id" element={<RevisionDetails />} />
        <Route path="/history" element={<RevisionHistory />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

