import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Clock,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { revisionService } from '../services/revisionService';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export function RevisionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [revision, setRevision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Completion form state
  const [understandingLevel, setUnderstandingLevel] = useState('MEDIUM');
  const [recallAssistance, setRecallAssistance] = useState('INDEPENDENT');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    loadRevision();
  }, [id]);

  async function loadRevision() {
    try {
      setLoading(true);
      setError('');
      const data = await revisionService.getRevision(id);
      setRevision(data.revision);
      if (data.revision.status === 'COMPLETED') {
        setUnderstandingLevel(data.revision.understandingLevel || 'MEDIUM');
        setRecallAssistance(data.revision.recallAssistance || 'INDEPENDENT');
        setRevisionNotes(data.revision.revisionNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch revision details');
    } finally {
      setLoading(false);
    }
  }

  // Calculate early completion eligibility:
  // Rule: Allowed up to 2 calendar days before scheduledDate
  function checkEligibility(scheduledDate) {
    if (!scheduledDate) return { allowed: true };
    const now = new Date();
    const [y, m, d] = scheduledDate.split('-').map(Number);
    const schedUtc = Date.UTC(y, m - 1, d);
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const daysRemaining = Math.round((schedUtc - todayUtc) / (1000 * 60 * 60 * 24));

    if (daysRemaining > 2) {
      return {
        allowed: false,
        daysRemaining,
        message: `This revision is scheduled for ${scheduledDate} (${daysRemaining} days away). It cannot be completed more than 2 calendar days early.`
      };
    }
    return { allowed: true, daysRemaining };
  }

  async function handleCompleteSubmit() {
    try {
      setSubmitting(true);
      setError('');
      const payload = {
        understandingLevel,
        recallAssistance,
        revisionNotes: revisionNotes.trim()
      };
      await revisionService.completeRevision(id, payload);
      setConfirmModalOpen(false);
      setSuccessMsg('Revision marked as completed! Your progress has been updated.');
      loadRevision();
    } catch (err) {
      setError(err.message || 'Failed to complete revision');
      setConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading revision checkpoint..." size="lg" />;
  }

  if (error && !revision) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <Button onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </Button>
      </div>
    );
  }

  const topic = revision?.topicId;
  const isCompleted = revision?.status === 'COMPLETED';
  const eligibility = checkEligibility(revision?.scheduledDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="red" size="sm">
                Revision {revision?.revisionNumber}
              </Badge>
              {topic?.category && <Badge variant="default">{topic.category}</Badge>}
              {isCompleted ? (
                <Badge variant="completed">Completed</Badge>
              ) : (
                <Badge variant="pending">Scheduled: {revision?.scheduledDate}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-black">
              {topic?.title || 'Learning Topic'}
            </h1>
          </div>
        </div>

        {topic?._id && (
          <Link to={`/topics/${topic._id}`}>
            <Button variant="secondary" size="sm">
              <BookOpen className="w-4 h-4" />
              Full Topic Details
            </Button>
          </Link>
        )}
      </div>

      {successMsg && (
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Early completion limitation alert */}
      {!isCompleted && !eligibility.allowed && (
        <Alert
          type="info"
          message={eligibility.message}
          className="border-blue-300 bg-blue-50/70"
        />
      )}

      {/* Recall Materials (Notes & Resources) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Personal Notes */}
        <Card className="p-6 space-y-3">
          <CardHeader
            title="Original Personal Notes"
            subtitle="Review your captured thoughts before testing your recall"
          />
          <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50/70 p-4 rounded-lg border border-gray-100 min-h-[140px]">
            {topic?.notes || <span className="italic text-gray-400">No notes saved for this topic.</span>}
          </div>
        </Card>

        {/* Resources to Revisit */}
        <Card className="p-6 space-y-3">
          <CardHeader
            title={`Reference Resources (${topic?.resources?.length || 0})`}
            subtitle="Original sources used when studying this concept"
          />
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {!topic?.resources || topic.resources.length === 0 ? (
              <p className="text-xs text-brand-secondaryGray italic py-4">No resources attached.</p>
            ) : (
              topic.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200 transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-brand-black truncate group-hover:text-brand-red">
                      {res.title}
                    </p>
                    <span className="text-[11px] text-brand-secondaryGray">{res.type}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-red flex-shrink-0" />
                </a>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Completion Card or Summary */}
      {isCompleted ? (
        <Card className="p-6 border-emerald-200 bg-emerald-50/20 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Revision Completed
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-xs text-brand-secondaryGray font-medium">Completed On</span>
              <p className="text-sm font-bold text-brand-black mt-0.5">
                {new Date(revision.completedAt).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-xs text-brand-secondaryGray font-medium">Understanding Level</span>
              <div className="mt-1">
                <Badge
                  variant={
                    revision.understandingLevel === 'EASY'
                      ? 'easy'
                      : revision.understandingLevel === 'HARD'
                      ? 'hard'
                      : 'medium'
                  }
                >
                  {revision.understandingLevel}
                </Badge>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-sm">
              <span className="text-xs text-brand-secondaryGray font-medium">Recall Assistance</span>
              <div className="mt-1">
                <Badge variant="default">{revision.recallAssistance?.replace('_', ' ')}</Badge>
              </div>
            </div>
          </div>

          {revision.revisionNotes && (
            <div className="bg-white p-4 rounded-lg border border-emerald-100 mt-2">
              <span className="text-xs font-semibold text-gray-700 block mb-1">Session Notes:</span>
              <p className="text-sm text-gray-800 italic">"{revision.revisionNotes}"</p>
            </div>
          )}
        </Card>
      ) : (
        /* Completion Form */
        <Card className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-brand-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-red" />
              Complete Revision {revision?.revisionNumber}
            </h2>
            <p className="text-xs text-brand-secondaryGray mt-0.5">
              Record how well you were able to recall this topic and how much help was needed.
            </p>
          </div>

          {/* Understanding Rating */}
          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
              1. Understanding / Recall Quality <span className="text-brand-red">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  value: 'EASY',
                  label: 'Easy',
                  desc: 'Recalled concept effortlessly with full clarity',
                  color: 'hover:border-emerald-500 peer-checked:border-emerald-600 peer-checked:bg-emerald-50/50'
                },
                {
                  value: 'MEDIUM',
                  label: 'Medium',
                  desc: 'Recalled with some thought; understood core logic',
                  color: 'hover:border-amber-500 peer-checked:border-amber-600 peer-checked:bg-amber-50/50'
                },
                {
                  value: 'HARD',
                  label: 'Hard',
                  desc: 'Struggled to remember important mechanics',
                  color: 'hover:border-red-500 peer-checked:border-red-600 peer-checked:bg-red-50/50'
                }
              ].map((opt) => (
                <label key={opt.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="understandingLevel"
                    value={opt.value}
                    checked={understandingLevel === opt.value}
                    onChange={(e) => setUnderstandingLevel(e.target.value)}
                    className="sr-only peer"
                  />
                  <div
                    className={`p-3.5 rounded-lg border-2 border-gray-200 transition-all ${opt.color}`}
                  >
                    <div className="font-bold text-sm text-brand-black">{opt.label}</div>
                    <p className="text-[11px] text-brand-secondaryGray mt-1 leading-normal">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Recall Assistance */}
          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">
              2. Recall Assistance Required <span className="text-brand-red">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  value: 'INDEPENDENT',
                  label: 'Independent',
                  desc: 'Recalled without looking at original resources'
                },
                {
                  value: 'PARTIAL',
                  label: 'Partial',
                  desc: 'Needed to glance at notes or quick hints'
                },
                {
                  value: 'NEEDED_RESOURCES',
                  label: 'Needed Resources',
                  desc: 'Had to re-read docs or re-watch video'
                }
              ].map((opt) => (
                <label key={opt.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="recallAssistance"
                    value={opt.value}
                    checked={recallAssistance === opt.value}
                    onChange={(e) => setRecallAssistance(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="p-3.5 rounded-lg border-2 border-gray-200 hover:border-brand-black peer-checked:border-brand-black peer-checked:bg-gray-50 transition-all">
                    <div className="font-bold text-sm text-brand-black">{opt.label}</div>
                    <p className="text-[11px] text-brand-secondaryGray mt-1 leading-normal">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Revision Notes */}
          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-1">
              3. Session Revision Notes <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g. Forgot the difference between wait() and sleep() again. Need to practice write-ahead logs."
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!eligibility.allowed || submitting}
              onClick={() => setConfirmModalOpen(true)}
            >
              Complete Revision {revision?.revisionNumber}
            </Button>
          </div>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Revision Completion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            You are marking <strong>Revision {revision?.revisionNumber}</strong> of{' '}
            <strong>"{topic?.title}"</strong> as completed with understanding level{' '}
            <strong>{understandingLevel}</strong> and <strong>{recallAssistance.replace('_', ' ')}</strong> recall.
          </p>
          <p className="text-xs text-brand-secondaryGray">
            Once completed, this milestone cannot be re-completed, and your learning metrics will be saved.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCompleteSubmit} loading={submitting}>
              Confirm & Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RevisionDetails;

