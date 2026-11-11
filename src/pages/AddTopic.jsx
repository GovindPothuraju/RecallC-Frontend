import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, BookOpen, Link as LinkIcon, FileText } from 'lucide-react';
import { topicService } from '../services/topicService';
import Card from '../components/Card';
import Button from '../components/Button';
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

const RESOURCE_TYPES = ['YOUTUBE', 'BLOG', 'GITHUB', 'DOCUMENTATION', 'OTHER'];

// Helper for today's date in YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function AddTopic() {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('DSA');
  const [customCategory, setCustomCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [studyDate, setStudyDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');
  const [resources, setResources] = useState([
    { title: '', url: '', type: 'YOUTUBE', description: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function addResourceField() {
    setResources([...resources, { title: '', url: '', type: 'OTHER', description: '' }]);
  }

  function removeResourceField(index) {
    setResources(resources.filter((_, idx) => idx !== index));
  }

  function updateResourceField(index, field, value) {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Topic title is required');
      return;
    }

    const finalCategory =
      selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;

    if (!finalCategory) {
      setError('Please specify a category');
      return;
    }

    // Filter out completely empty resource rows
    const cleanedResources = resources.filter(
      (r) => r.title.trim() !== '' || r.url.trim() !== ''
    );

    // Validate resource URLs
    for (let i = 0; i < cleanedResources.length; i++) {
      const r = cleanedResources[i];
      if (!r.title.trim()) {
        setError(`Resource #${i + 1} is missing a title`);
        return;
      }
      try {
        const parsed = new URL(r.url.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error();
        }
      } catch (_) {
        setError(`Resource #${i + 1} must have a valid URL (starting with http:// or https://)`);
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        category: finalCategory,
        subcategory: subcategory.trim(),
        studyDate,
        notes: notes.trim(),
        resources: cleanedResources
      };

      const result = await topicService.createTopic(payload);
      navigate(`/topics/${result.topic._id}`, {
        state: { message: 'Topic created and 9 revision dates automatically scheduled!' }
      });
    } catch (err) {
      setError(err.message || 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-black">Add Learning Topic</h1>
          <p className="text-sm text-brand-secondaryGray">
            Save what you studied today. RecallC will automatically generate your 9-stage revision timeline.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Topic Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-brand-black flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-red" />
            Topic Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Topic Title <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java Multithreading & Synchronization, Sliding Window Technique"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category <span className="text-brand-red">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Custom Category Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Kubernetes, Microservices"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subcategory <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Concurrency, Dynamic Programming"
                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Study Date <span className="text-brand-red">*</span>
            </label>
            <input
              type="date"
              required
              value={studyDate}
              onChange={(e) => setStudyDate(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-brand-secondaryGray mt-1">
              Note: The 9 revision dates (R1 to R9) will be locked from this study date.
            </p>
          </div>
        </Card>

        {/* Learning Resources */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-black flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-brand-red" />
              Learning Resources ({resources.length})
            </h2>
            <Button type="button" onClick={addResourceField} variant="secondary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Add Another Resource
            </Button>
          </div>

          <div className="space-y-3">
            {resources.map((res, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-secondaryGray">
                    Resource #{index + 1}
                  </span>
                  {resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResourceField(index)}
                      className="text-gray-400 hover:text-brand-red p-1 rounded transition-colors"
                      title="Remove resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => updateResourceField(index, 'title', e.target.value)}
                      placeholder="e.g. YouTube Video, Official Oracle Docs, Blog"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={res.type}
                      onChange={(e) => updateResourceField(index, 'type', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-red"
                    >
                      {RESOURCE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    URL (Link)
                  </label>
                  <input
                    type="url"
                    value={res.url}
                    onChange={(e) => updateResourceField(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Personal Notes */}
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-brand-black flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-red" />
            Personal Learning Notes
          </h2>
          <div>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Studied thread lifecycle, wait(), notify(), deadlocks, and race conditions. Important: synchronized blocks lock on the monitor of the specified object..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all leading-relaxed"
            />
            <p className="text-[11px] text-brand-secondaryGray mt-1">
              These original notes will be presented to you during each recall checkpoint.
            </p>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} size="lg">
            Save Topic & Generate Schedule
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTopic;

