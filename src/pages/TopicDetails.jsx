import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Link as LinkIcon,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Plus
} from 'lucide-react';
import { topicService } from '../services/topicService';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const PRESET_CATEGORIES = [
  'DSA',
  'Java',
  'OOPS',
  'DBMS',
  'SQL',
  'Operating Systems',
  'Computer Networks',
  'JavaScript',
  'React',
  'Node.js',
  'System Design',
  'Other'
];

export function TopicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  // Edit Topic Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSubcategory, setEditSubcategory] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editResources, setEditResources] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTopic();
  }, [id]);

  async function loadTopic() {
    try {
      setLoading(true);
      setError('');
      const data = await topicService.getTopic(id);
      setTopic(data.topic);
      // Pre-fill edit modal form
      setEditTitle(data.topic.title);
      setEditCategory(data.topic.category);
      setEditSubcategory(data.topic.subcategory || '');
      setEditNotes(data.topic.notes || '');
      setEditResources(data.topic.resources ? [...data.topic.resources] : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch topic details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      setSavingEdit(true);
      const payload = {
        title: editTitle.trim(),
        category: editCategory.trim(),
        subcategory: editSubcategory.trim(),
        notes: editNotes.trim(),
        resources: editResources
      };
      await topicService.updateTopic(id, payload);
      setIsEditOpen(false);
      setSuccessMsg('Topic updated successfully (revision schedule preserved)');
      loadTopic();
    } catch (err) {
      setError(err.message || 'Failed to update topic');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteTopic() {
    try {
      setDeleting(true);
      await topicService.deleteTopic(id);
      navigate('/topics', {
        state: { message: `Topic "${topic.title}" and its revisions successfully deleted` }
      });
    } catch (err) {
      setError(err.message || 'Failed to delete topic');
      setDeleting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading topic details & revision timeline..." size="lg" />;
  }

  if (error || !topic) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error || 'Topic not found'} />
        <Button onClick={() => navigate('/topics')} variant="secondary">
          Back to Topics
        </Button>
      </div>
    );
  }

  // Today's date string for relative status
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/topics')}
            className="p-2 text-gray-500 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Topics"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="default">{topic.category}</Badge>
              {topic.subcategory && (
                <span className="text-xs text-brand-secondaryGray font-medium">
                  • {topic.subcategory}
                </span>
              )}
              <span className="text-xs text-brand-secondaryGray flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Studied: {topic.studyDate}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-black">
              {topic.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsEditOpen(true)} variant="secondary" size="sm">
            <Edit className="w-4 h-4" />
            Edit Topic
          </Button>
          <Button onClick={() => setIsDeleteOpen(true)} variant="danger" size="sm">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {successMsg && (
        <Alert
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg('')}
        />
      )}

      {/* Grid: Notes & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Notes (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader
              title="Personal Learning Notes"
              subtitle="Original insights captured during your study session"
            />
            <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {topic.notes ? (
                topic.notes
              ) : (
                <span className="text-brand-secondaryGray italic">No notes recorded for this topic.</span>
              )}
            </div>
          </Card>
        </div>

        {/* Resources (1 col) */}
        <div>
          <Card className="p-6 h-full">
            <CardHeader
              title={`Resources (${topic.resources?.length || 0})`}
              subtitle="Saved references for this concept"
            />
            <div className="mt-4 space-y-2.5">
              {!topic.resources || topic.resources.length === 0 ? (
                <p className="text-xs text-brand-secondaryGray italic">No resources attached.</p>
              ) : (
                topic.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-black truncate group-hover:text-brand-red transition-colors">
                        {res.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-red flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="sm">
                        {res.type}
                      </Badge>
                      <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                        {res.url}
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 9-Stage Revision Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-red" />
              9-Stage Spaced Repetition Schedule
            </h2>
            <p className="text-xs text-brand-secondaryGray mt-0.5">
              Deterministic revision schedule computed from {topic.studyDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.revisions?.map((rev) => {
            const isCompleted = rev.status === 'COMPLETED';
            const isOverdue = !isCompleted && rev.scheduledDate < todayStr;
            const isDueToday = !isCompleted && rev.scheduledDate === todayStr;

            return (
              <Card
                key={rev._id}
                className={`p-4 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isOverdue
                    ? 'border-red-300 bg-red-50/30'
                    : isDueToday
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-black">
                      Revision {rev.revisionNumber}
                    </span>
                    {isCompleted ? (
                      <Badge variant="completed" size="sm">
                        Completed
                      </Badge>
                    ) : isOverdue ? (
                      <Badge variant="overdue" size="sm">
                        Overdue
                      </Badge>
                    ) : isDueToday ? (
                      <Badge variant="dueToday" size="sm">
                        Due Today
                      </Badge>
                    ) : (
                      <Badge variant="pending" size="sm">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs space-y-1 text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-700">Scheduled:</span>{' '}
                    {rev.scheduledDate}
                  </p>
                  {isCompleted && (
                    <>
                      <p>
                        <span className="font-semibold text-gray-700">Completed:</span>{' '}
                        {new Date(rev.completedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Badge
                          variant={
                            rev.understandingLevel === 'EASY'
                              ? 'easy'
                              : rev.understandingLevel === 'HARD'
                              ? 'hard'
                              : 'medium'
                          }
                          size="sm"
                        >
                          {rev.understandingLevel}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {rev.recallAssistance?.replace('_', ' ')}
                        </Badge>
                      </div>
                      {rev.revisionNotes && (
                        <p className="text-xs text-gray-500 italic mt-1.5 pt-1.5 border-t border-gray-100">
                          "{rev.revisionNotes}"
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  {isCompleted ? (
                    <Button
                      onClick={() => navigate(`/revisions/${rev._id}`)}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/revisions/${rev._id}`)}
                      variant={isOverdue || isDueToday ? 'primary' : 'secondary'}
                      size="sm"
                      className="text-xs w-full justify-center"
                    >
                      {isOverdue ? 'Complete Overdue' : isDueToday ? 'Revise Today' : 'Revise Now'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Topic Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => !savingEdit && setIsEditOpen(false)}
        title="Edit Learning Topic"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Topic Title</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={editSubcategory}
                onChange={(e) => setEditSubcategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Study Date (Immutable)
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={topic.studyDate}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
            />
            <p className="text-[11px] text-brand-secondaryGray mt-0.5">
              Study date cannot be edited to protect existing revision timelines.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Personal Notes</label>
            <textarea
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
              disabled={savingEdit}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => !deleting && setIsDeleteOpen(false)}
        title="Delete Topic & Revision Schedule"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Permanent Cascade Deletion</p>
              <p className="text-xs text-red-700 mt-1">
                Are you sure you want to delete <strong>"{topic.title}"</strong>? This will remove all 9 scheduled revision records and any completion history associated with this topic.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTopic}
              loading={deleting}
              className="bg-brand-red text-white hover:bg-brand-deepRed"
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TopicDetails;

