import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Calendar,
  ExternalLink,
  Trash2,
  Edit,
  ArrowRight,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { topicService } from '../services/topicService';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

const CATEGORIES = [
  'ALL',
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

export function Topics() {
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteTopicData, setDeleteTopicData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadTopics(1);
  }, [selectedCategory]);

  async function loadTopics(page = 1) {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 12,
        category: selectedCategory,
        search: searchQuery.trim()
      };
      const res = await topicService.getTopics(params);
      setTopics(res.data.topics || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadTopics(1);
  }

  async function confirmDelete() {
    if (!deleteTopicData) return;
    try {
      setDeleting(true);
      await topicService.deleteTopic(deleteTopicData._id);
      setDeleteTopicData(null);
      setSuccessMsg(`Topic "${deleteTopicData.title}" and its revisions deleted successfully`);
      loadTopics(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete topic');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-black">My Learning Topics</h1>
          <p className="text-sm text-brand-secondaryGray mt-0.5">
            Preserved concepts and their spaced repetition timelines
          </p>
        </div>
        <Link to="/topics/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Topic
          </Button>
        </Link>
      </div>

      {successMsg && (
        <Alert
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg('')}
        />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic title, subcategory, or notes..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-black text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching topics..." />
      ) : topics.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No topics found"
          description={
            searchQuery || selectedCategory !== 'ALL'
              ? 'No topics match your current filter or search criteria.'
              : "You haven't saved any learning topics yet. Add your first topic to begin!"
          }
          actionLabel="Add New Topic"
          onAction={() => navigate('/topics/new')}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Card key={topic._id} hover className="flex flex-col justify-between p-5">
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="default" size="sm">
                    {topic.category}
                  </Badge>
                  <span className="text-xs text-brand-secondaryGray flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {topic.studyDate}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-brand-black line-clamp-1">
                  {topic.title}
                </h3>
                {topic.subcategory && (
                  <p className="text-xs text-brand-secondaryGray font-medium mt-0.5">
                    {topic.subcategory}
                  </p>
                )}

                {/* Notes preview */}
                {topic.notes && (
                  <p className="text-xs text-gray-600 line-clamp-2 mt-2 bg-gray-50/70 p-2 rounded border border-gray-100">
                    {topic.notes}
                  </p>
                )}

                {/* Next pending milestone badge */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-brand-secondaryGray font-medium">Next Revision:</span>
                  {topic.nextRevision ? (
                    <span className="font-semibold text-brand-red flex items-center gap-1">
                      <Clock className="w-3 h-3" /> R{topic.nextRevision.revisionNumber} ({topic.nextRevision.scheduledDate})
                    </span>
                  ) : (
                    <span className="font-medium text-emerald-600">All 9 Completed</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-brand-secondaryGray">
                  <span>{topic.resources?.length || 0} resources</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDeleteTopicData(topic)}
                    className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete topic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Button
                    onClick={() => navigate(`/topics/${topic._id}`)}
                    variant="secondary"
                    size="sm"
                    className="text-xs py-1 px-2.5"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => loadTopics(pagination.page - 1)}
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
            onClick={() => loadTopics(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Cascade Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTopicData}
        onClose={() => !deleting && setDeleteTopicData(null)}
        title="Delete Topic"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Permanent Cascade Deletion</p>
              <p className="text-xs text-red-700 mt-1">
                Deleting <strong>"{deleteTopicData?.title}"</strong> will permanently delete this topic and all 9 of its scheduled and completed revision records. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTopicData(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleting}
              className="bg-brand-red text-white hover:bg-brand-deepRed"
            >
              Delete Topic & Revisions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Topics;

