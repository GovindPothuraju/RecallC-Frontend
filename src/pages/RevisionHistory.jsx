import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, CheckCircle2, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { statsService } from '../services/statsService';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export function RevisionHistory() {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory(1);
  }, []);

  async function loadHistory(page = 1) {
    try {
      setLoading(true);
      setError('');
      const res = await statsService.getRevisionHistory({ page, limit: 15 });
      setHistory(res.data.history || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch revision history');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-black flex items-center gap-2">
          <History className="w-6 h-6 text-brand-red" />
          Revision History
        </h1>
        <p className="text-sm text-brand-secondaryGray mt-0.5">
          Audit log of all your completed recall sessions across topics
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Fetching revision log..." />
      ) : history.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed revisions yet"
          description="Whenever you complete a scheduled revision, it will be logged here with your recall quality rating and notes."
          actionLabel="Check Today's Schedule"
          onAction={() => window.location.href = '/'}
        />
      ) : (
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider bg-gray-50 rounded-lg border border-gray-200">
            <div className="col-span-4">Topic & Category</div>
            <div className="col-span-2">Revision</div>
            <div className="col-span-2">Completed At</div>
            <div className="col-span-2">Recall Quality</div>
            <div className="col-span-2 text-right">Assistance</div>
          </div>

          {history.map((item) => (
            <Card key={item._id} className="p-4 hover:border-gray-300 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Topic Info */}
                <div className="md:col-span-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" size="sm">
                      {item.topicId?.category || 'General'}
                    </Badge>
                  </div>
                  <Link
                    to={`/topics/${item.topicId?._id}`}
                    className="text-sm font-bold text-brand-black hover:text-brand-red truncate block transition-colors"
                  >
                    {item.topicId?.title || 'Untitled Topic'}
                  </Link>
                </div>

                {/* Milestone */}
                <div className="md:col-span-2 text-xs">
                  <span className="font-semibold text-brand-black">Revision {item.revisionNumber}</span>
                  <div className="text-[11px] text-brand-secondaryGray">
                    Scheduled: {item.scheduledDate}
                  </div>
                </div>

                {/* Completion Date */}
                <div className="md:col-span-2 text-xs text-gray-700">
                  <span className="font-medium">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </span>
                  <div className="text-[11px] text-brand-secondaryGray">
                    {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Recall Quality */}
                <div className="md:col-span-2">
                  <Badge
                    variant={
                      item.understandingLevel === 'EASY'
                        ? 'easy'
                        : item.understandingLevel === 'HARD'
                        ? 'hard'
                        : 'medium'
                    }
                    size="sm"
                  >
                    {item.understandingLevel || 'N/A'}
                  </Badge>
                </div>

                {/* Assistance */}
                <div className="md:col-span-2 md:text-right">
                  <Badge variant="default" size="sm">
                    {item.recallAssistance?.replace('_', ' ') || 'INDEPENDENT'}
                  </Badge>
                </div>
              </div>

              {item.revisionNotes && (
                <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded">
                  <span className="font-semibold text-gray-700">Session Note:</span> "{item.revisionNotes}"
                </div>
              )}
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => loadHistory(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-gray-600 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadHistory(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RevisionHistory;

