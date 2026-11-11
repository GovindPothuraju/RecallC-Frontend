import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { statsService } from '../services/statsService';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');
      const res = await statsService.getDashboardSummary();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading your revision desk..." size="lg" />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <Button onClick={loadDashboard} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, dueTodayRevisions = [], overdueRevisions = [], upcomingRevisions = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-black">
            Revision Desk
          </h1>
          <p className="text-sm text-brand-secondaryGray mt-0.5">
            Today is <span className="font-semibold text-brand-black">{data?.todayDate}</span>. Here is your memory retention agenda.
          </p>
        </div>
        <Link to="/topics/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add New Topic
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
              Due Today
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-black">{stats?.dueTodayCount ?? 0}</div>
            <p className="text-xs text-brand-secondaryGray mt-1">Ready for recall check</p>
          </div>
        </Card>

        {/* Overdue */}
        <Card className="border-l-4 border-l-brand-red">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
              Overdue
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-brand-red">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-red">{stats?.overdueCount ?? 0}</div>
            <p className="text-xs text-brand-secondaryGray mt-1">Needs immediate recall</p>
          </div>
        </Card>

        {/* Total Topics */}
        <Card className="border-l-4 border-l-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
              Total Topics
            </span>
            <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-black">{stats?.totalTopics ?? 0}</div>
            <p className="text-xs text-brand-secondaryGray mt-1">Concepts stored in RecallC</p>
          </div>
        </Card>

        {/* Completed Revisions */}
        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-black">{stats?.completedRevisions ?? 0}</div>
            <p className="text-xs text-brand-secondaryGray mt-1">Successfully recalled</p>
          </div>
        </Card>
      </div>

      {/* Overall Progress Bar */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-red" />
            <span className="text-sm font-semibold text-brand-black">Spaced Repetition Retention Rate</span>
          </div>
          <span className="text-sm font-bold text-brand-red">{stats?.overallCompletionRate || 0}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-brand-red h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${stats?.overallCompletionRate || 0}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-brand-secondaryGray mt-2">
          <span>{stats?.completedRevisions ?? 0} revisions completed</span>
          <span>{stats?.pendingRevisions ?? 0} revisions remaining</span>
        </div>
      </Card>

      {/* Main Grid: Overdue & Due Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Revisions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-brand-black">Overdue Revisions</h2>
              {overdueRevisions.length > 0 && (
                <Badge variant="overdue" size="sm">
                  {overdueRevisions.length} Missed
                </Badge>
              )}
            </div>
            {overdueRevisions.length > 0 && (
              <span className="text-xs text-brand-secondaryGray font-medium">Prioritize these</span>
            )}
          </div>

          {overdueRevisions.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No overdue revisions!"
              description="Great job! You haven't fallen behind on any learning milestones."
            />
          ) : (
            <div className="space-y-3">
              {overdueRevisions.map((rev) => (
                <Card key={rev._id} hover className="border-l-4 border-l-brand-red p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="red" size="sm">
                          R{rev.revisionNumber}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {rev.topicId?.category || 'General'}
                        </Badge>
                        <span className="text-xs text-brand-red font-medium">
                          Scheduled: {rev.scheduledDate}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-brand-black truncate">
                        {rev.topicId?.title || 'Untitled Topic'}
                      </h3>
                      {rev.topicId?.subcategory && (
                        <p className="text-xs text-brand-secondaryGray mt-0.5">
                          {rev.topicId.subcategory}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate(`/revisions/${rev._id}`)}
                      variant="primary"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      Revise Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Due Today */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-brand-black">Today's Schedule</h2>
              {dueTodayRevisions.length > 0 && (
                <Badge variant="dueToday" size="sm">
                  {dueTodayRevisions.length} Due
                </Badge>
              )}
            </div>
            <span className="text-xs text-brand-secondaryGray font-medium">{data?.todayDate}</span>
          </div>

          {dueTodayRevisions.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Nothing due today!"
              description={
                stats?.totalTopics === 0
                  ? 'Get started by creating your first technical learning topic.'
                  : "You're all caught up for today. Add a new topic or revisit your topics library."
              }
              actionLabel={stats?.totalTopics === 0 ? 'Add First Topic' : 'Browse Topics'}
              onAction={() => navigate(stats?.totalTopics === 0 ? '/topics/new' : '/topics')}
              actionIcon={Plus}
            />
          ) : (
            <div className="space-y-3">
              {dueTodayRevisions.map((rev) => (
                <Card key={rev._id} hover className="border-l-4 border-l-amber-500 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="amber" size="sm">
                          R{rev.revisionNumber}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {rev.topicId?.category || 'General'}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-bold text-brand-black truncate">
                        {rev.topicId?.title || 'Untitled Topic'}
                      </h3>
                      {rev.topicId?.subcategory && (
                        <p className="text-xs text-brand-secondaryGray mt-0.5">
                          {rev.topicId.subcategory}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate(`/revisions/${rev._id}`)}
                      variant="secondary"
                      size="sm"
                      className="border-amber-300 text-amber-900 hover:bg-amber-50 flex-shrink-0"
                    >
                      Revise
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Revisions Preview */}
      {upcomingRevisions.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-brand-black uppercase tracking-wider">
              Upcoming Revisions Ahead
            </h2>
            <Link to="/topics" className="text-xs font-semibold text-brand-red hover:underline flex items-center gap-1">
              View all topics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingRevisions.map((rev) => (
              <Card key={rev._id} className="p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="default" size="sm">
                    R{rev.revisionNumber}
                  </Badge>
                  <span className="text-xs text-brand-secondaryGray font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {rev.scheduledDate}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-brand-black truncate">
                  {rev.topicId?.title}
                </h4>
                <p className="text-xs text-brand-secondaryGray mt-0.5 truncate">
                  {rev.topicId?.category}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

