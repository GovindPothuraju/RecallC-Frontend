import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award
} from 'lucide-react';
import { statsService } from '../services/statsService';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      setLoading(true);
      setError('');
      const res = await statsService.getProgressSummary();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load progress analytics');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Analyzing your revision progress..." size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error || 'Failed to load data'} />
        <Button onClick={loadProgress} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  const { overview, categoryBreakdown = {}, understandingBreakdown = {}, assistanceBreakdown = {} } = data;

  const totalAssistance =
    (assistanceBreakdown.INDEPENDENT || 0) +
    (assistanceBreakdown.PARTIAL || 0) +
    (assistanceBreakdown.NEEDED_RESOURCES || 0);

  const totalUnderstanding =
    (understandingBreakdown.EASY || 0) +
    (understandingBreakdown.MEDIUM || 0) +
    (understandingBreakdown.HARD || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-black flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-red" />
          Learning Analytics & Progress
        </h1>
        <p className="text-sm text-brand-secondaryGray mt-0.5">
          Spaced-repetition completion rates, category distribution, and recall metrics
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-gray-900">
          <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
            Total Topics
          </span>
          <div className="text-2xl font-bold text-brand-black mt-1">
            {overview.totalTopics}
          </div>
          <p className="text-[11px] text-brand-secondaryGray mt-0.5">Stored in library</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
            Revisions Completed
          </span>
          <div className="text-2xl font-bold text-brand-black mt-1">
            {overview.completedRevisions}
          </div>
          <p className="text-[11px] text-brand-secondaryGray mt-0.5">Milestones checked</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-600">
          <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
            Pending Milestones
          </span>
          <div className="text-2xl font-bold text-brand-black mt-1">
            {overview.pendingRevisions}
          </div>
          <p className="text-[11px] text-brand-secondaryGray mt-0.5">Upcoming on schedule</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-brand-red">
          <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
            Retention Rate
          </span>
          <div className="text-2xl font-bold text-brand-red mt-1">
            {overview.completionRate}%
          </div>
          <p className="text-[11px] text-brand-secondaryGray mt-0.5">Overall schedule pace</p>
        </Card>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Topics by Category"
            subtitle="Distribution of concepts across technical domains"
          />
          {Object.keys(categoryBreakdown).length === 0 ? (
            <p className="text-xs text-brand-secondaryGray italic py-4">No categories recorded yet.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {Object.entries(categoryBreakdown).map(([category, count]) => {
                const pct = overview.totalTopics > 0 ? Math.round((count / overview.totalTopics) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-brand-black">
                      <span>{category}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-black h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recall Quality (Understanding) */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Recall Quality Rating"
            subtitle="How well you remembered concepts when revising"
          />
          {totalUnderstanding === 0 ? (
            <p className="text-xs text-brand-secondaryGray italic py-4">
              Complete your first revision to record recall quality ratings.
            </p>
          ) : (
            <div className="space-y-4 pt-2">
              {[
                {
                  label: 'Easy (High Retention)',
                  count: understandingBreakdown.EASY || 0,
                  color: 'bg-emerald-600',
                  badge: 'easy'
                },
                {
                  label: 'Medium (Adequate Retention)',
                  count: understandingBreakdown.MEDIUM || 0,
                  color: 'bg-amber-500',
                  badge: 'medium'
                },
                {
                  label: 'Hard (Needs Review)',
                  count: understandingBreakdown.HARD || 0,
                  color: 'bg-brand-red',
                  badge: 'hard'
                }
              ].map((item) => {
                const pct = Math.round((item.count / totalUnderstanding) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-brand-black">{item.label}</span>
                      <span className="text-brand-secondaryGray">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recall Assistance */}
        <Card className="p-6 space-y-4 lg:col-span-2">
          <CardHeader
            title="Assistance Level Breakdown"
            subtitle="Degree of resource support needed during recall checkpoints"
          />
          {totalAssistance === 0 ? (
            <p className="text-xs text-brand-secondaryGray italic py-4">
              No assistance metrics logged yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  label: 'Independent Recall',
                  desc: 'Recalled without consulting resources',
                  count: assistanceBreakdown.INDEPENDENT || 0,
                  pct: Math.round(((assistanceBreakdown.INDEPENDENT || 0) / totalAssistance) * 100),
                  border: 'border-emerald-200 bg-emerald-50/30'
                },
                {
                  label: 'Partial Assistance',
                  desc: 'Needed quick glances at notes/hints',
                  count: assistanceBreakdown.PARTIAL || 0,
                  pct: Math.round(((assistanceBreakdown.PARTIAL || 0) / totalAssistance) * 100),
                  border: 'border-amber-200 bg-amber-50/30'
                },
                {
                  label: 'Needed Resources',
                  desc: 'Required original videos or documentation',
                  count: assistanceBreakdown.NEEDED_RESOURCES || 0,
                  pct: Math.round(((assistanceBreakdown.NEEDED_RESOURCES || 0) / totalAssistance) * 100),
                  border: 'border-gray-200 bg-gray-50'
                }
              ].map((item) => (
                <div key={item.label} className={`p-4 rounded-xl border ${item.border}`}>
                  <span className="text-xs font-bold text-brand-black block">{item.label}</span>
                  <p className="text-[11px] text-brand-secondaryGray mt-0.5">{item.desc}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-brand-black">{item.count}</span>
                    <span className="text-xs font-semibold text-brand-secondaryGray">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Progress;

