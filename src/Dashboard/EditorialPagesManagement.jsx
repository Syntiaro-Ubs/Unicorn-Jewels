import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Image as ImageIcon,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  Upload
} from 'lucide-react';
import defaultPageContent from '../../shared/pageContentDefaults.json';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

const PAGE_OPTIONS = [
  {
    id: 'story',
    label: 'Our Vision',
    description: 'Edit the narrative sections that appear below the hero on the vision page.',
    icon: BookOpen
  }
];

const cloneContent = (value) => JSON.parse(JSON.stringify(value));

const mergeWithDefaults = (defaults, incoming) => {
  if (Array.isArray(defaults)) {
    const source = Array.isArray(incoming) ? incoming : [];
    return defaults.map((item, index) => mergeWithDefaults(item, source[index]));
  }

  if (defaults && typeof defaults === 'object') {
    const source = incoming && typeof incoming === 'object' ? incoming : {};
    return Object.keys(defaults).reduce((acc, key) => {
      acc[key] = mergeWithDefaults(defaults[key], source[key]);
      return acc;
    }, {});
  }

  return incoming ?? defaults;
};

const fieldLabelClass = 'text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em] ml-1';
const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm';
const textareaClass = `${inputClass} resize-none`;

const resolveImageSource = (value = '') => {
  if (!value) return '';
  return value.startsWith('http') ? value : `http://localhost:5000${value}`;
};

function ManagedImageField({
  label,
  value,
  uploadKey,
  helperText,
  uploading,
  error,
  onChange,
  onUpload,
  onRemove
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className={fieldLabelClass}>{label}</label>
        {helperText && <p className="text-xs text-slate-400 leading-5 px-1">{helperText}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px,1fr] items-start">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {value ? (
            <ImageWithFallback
              src={resolveImageSource(value)}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.22em]">No image</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="Paste an image URL or upload below"
          />

          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(file, uploadKey);
                  }
                  e.target.value = '';
                }}
              />
            </label>

            {value && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium px-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorialPagesManagement() {
  const [activePage, setActivePage] = useState('story');
  const [pageContent, setPageContent] = useState(() => ({
    story: cloneContent(defaultPageContent.story)
  }));
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState({ pageKey: null, status: null });
  const [uploadingFields, setUploadingFields] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);

      try {
        const results = await Promise.all(
          PAGE_OPTIONS.map(async ({ id }) => {
            const response = await fetch(`http://localhost:5000/api/content/page-content/${id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${id} page content`);
            }

            const data = await response.json();
            return [id, mergeWithDefaults(defaultPageContent[id], data)];
          })
        );

        setPageContent(Object.fromEntries(results));
      } catch (error) {
        console.error('Error fetching editorial page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const updatePage = (pageKey, updater) => {
    setPageContent((prev) => ({
      ...prev,
      [pageKey]: updater(cloneContent(prev[pageKey]))
    }));
  };

  const updateSectionField = (pageKey, sectionKey, field, value) => {
    updatePage(pageKey, (draft) => {
      draft[sectionKey][field] = value;
      return draft;
    });
  };

  const updateArrayField = (pageKey, arrayKey, index, field, value) => {
    updatePage(pageKey, (draft) => {
      draft[arrayKey][index][field] = value;
      return draft;
    });
  };

  const updateNestedArrayField = (pageKey, sectionKey, arrayKey, index, field, value) => {
    updatePage(pageKey, (draft) => {
      draft[sectionKey][arrayKey][index][field] = value;
      return draft;
    });
  };

  const handleSave = async () => {
    setSaveState({ pageKey: activePage, status: 'saving' });

    try {
      const response = await fetch(`http://localhost:5000/api/content/page-content/${activePage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageContent[activePage])
      });

      if (!response.ok) {
        throw new Error('Failed to save page content');
      }

      setSaveState({ pageKey: activePage, status: 'success' });
      setTimeout(() => {
        setSaveState((current) => current.pageKey === activePage ? { pageKey: activePage, status: null } : current);
      }, 1800);
    } catch (error) {
      console.error('Error saving editorial page content:', error);
      setSaveState({ pageKey: activePage, status: 'error' });
    }
  };

  const handleImageUpload = async (file, uploadKey, onUploaded) => {
    setUploadingFields((prev) => ({ ...prev, [uploadKey]: true }));
    setUploadErrors((prev) => ({ ...prev, [uploadKey]: '' }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/content/page-content-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      onUploaded(data.imageUrl);
    } catch (error) {
      console.error('Error uploading page content image:', error);
      setUploadErrors((prev) => ({
        ...prev,
        [uploadKey]: 'Upload failed. Please try again.'
      }));
    } finally {
      setUploadingFields((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const activeContent = pageContent[activePage];

  const renderStoryEditor = () => (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Hero Banner</p>
        <p className="mt-2 text-sm text-slate-600 leading-7">
          The main hero title, subtitle, description, and hero image for the vision page are controlled from Banner Management using the <span className="font-semibold text-slate-900">story</span> page key.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-lg text-slate-900">Hero Intro</p>
            <p className="text-sm text-slate-500 mt-1">Customize the eyebrow line shown above the banner headline.</p>
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Hero Eyebrow</label>
            <input
              type="text"
              value={activeContent.hero.eyebrow}
              onChange={(e) => updateSectionField('story', 'hero', 'eyebrow', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-lg text-slate-900">Quote Section</p>
            <p className="text-sm text-slate-500 mt-1">This is the large statement shown on the black interlude panel.</p>
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Quote Text</label>
            <textarea
              rows={5}
              value={activeContent.quote.text}
              onChange={(e) => updateSectionField('story', 'quote', 'text', e.target.value)}
              className={textareaClass}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
        <div>
          <p className="text-lg text-slate-900">Craft Section</p>
          <p className="text-sm text-slate-500 mt-1">Edit the atelier story, supporting image, and footer line.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={fieldLabelClass}>Section Eyebrow</label>
            <input
              type="text"
              value={activeContent.craft.eyebrow}
              onChange={(e) => updateSectionField('story', 'craft', 'eyebrow', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Title</label>
            <input
              type="text"
              value={activeContent.craft.title}
              onChange={(e) => updateSectionField('story', 'craft', 'title', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Accent Word</label>
            <input
              type="text"
              value={activeContent.craft.accent}
              onChange={(e) => updateSectionField('story', 'craft', 'accent', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <ManagedImageField
          label="Craft Section Image"
          value={activeContent.craft.image_url}
          uploadKey="story-craft-image"
          helperText="Upload the atelier image shown beside the story content."
          uploading={!!uploadingFields['story-craft-image']}
          error={uploadErrors['story-craft-image']}
          onChange={(value) => updateSectionField('story', 'craft', 'image_url', value)}
          onUpload={(file) => handleImageUpload(file, 'story-craft-image', (imageUrl) => {
            updateSectionField('story', 'craft', 'image_url', imageUrl);
          })}
          onRemove={() => updateSectionField('story', 'craft', 'image_url', '')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={fieldLabelClass}>Paragraph One</label>
            <textarea
              rows={5}
              value={activeContent.craft.paragraph_one}
              onChange={(e) => updateSectionField('story', 'craft', 'paragraph_one', e.target.value)}
              className={textareaClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Paragraph Two</label>
            <textarea
              rows={5}
              value={activeContent.craft.paragraph_two}
              onChange={(e) => updateSectionField('story', 'craft', 'paragraph_two', e.target.value)}
              className={textareaClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={fieldLabelClass}>Footer Line</label>
          <input
            type="text"
            value={activeContent.craft.footer}
            onChange={(e) => updateSectionField('story', 'craft', 'footer', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
        <div>
          <p className="text-lg text-slate-900">Final Statement</p>
          <p className="text-sm text-slate-500 mt-1">Control the closing architecture image and final call to action.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={fieldLabelClass}>Button Text</label>
            <input
              type="text"
              value={activeContent.finale.button_text}
              onChange={(e) => updateSectionField('story', 'finale', 'button_text', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Line One</label>
            <input
              type="text"
              value={activeContent.finale.title_line_one}
              onChange={(e) => updateSectionField('story', 'finale', 'title_line_one', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Accent One</label>
            <input
              type="text"
              value={activeContent.finale.accent_one}
              onChange={(e) => updateSectionField('story', 'finale', 'accent_one', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Line Two</label>
            <input
              type="text"
              value={activeContent.finale.title_line_two}
              onChange={(e) => updateSectionField('story', 'finale', 'title_line_two', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={fieldLabelClass}>Accent Two</label>
            <input
              type="text"
              value={activeContent.finale.accent_two}
              onChange={(e) => updateSectionField('story', 'finale', 'accent_two', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <ManagedImageField
          label="Final Background Image"
          value={activeContent.finale.image_url}
          uploadKey="story-finale-image"
          helperText="Upload the full-width background image for the closing statement."
          uploading={!!uploadingFields['story-finale-image']}
          error={uploadErrors['story-finale-image']}
          onChange={(value) => updateSectionField('story', 'finale', 'image_url', value)}
          onUpload={(file) => handleImageUpload(file, 'story-finale-image', (imageUrl) => {
            updateSectionField('story', 'finale', 'image_url', imageUrl);
          })}
          onRemove={() => updateSectionField('story', 'finale', 'image_url', '')}
        />
      </div>
    </div>
  );



  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Sparkles size={16} />
            <span className="text-[11px] uppercase tracking-[0.26em] font-bold">Editorial Pages</span>
          </div>
          <h4 className="text-2xl text-slate-900">Our Vision</h4>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Manage the page sections beyond the hero banner. Use Banner Management for the opening headline and hero image, then use this editor for the rest of the page.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {PAGE_OPTIONS.map((page) => {
            const Icon = page.icon;
            const isActive = activePage === page.id;

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePage(page.id)}
                className={`px-4 py-3 rounded-2xl border transition-all text-left min-w-[180px] ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span className="text-sm font-semibold">{page.label}</span>
                </div>
                <p className={`text-xs mt-2 leading-5 ${isActive ? 'text-white/75' : 'text-slate-400'}`}>
                  {page.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading page content...</p>
        </div>
      ) : (
        <>
          <div className="p-6">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {activePage === 'story' && renderStoryEditor()}
            </motion.div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-h-[20px]">
              {saveState.pageKey === activePage && saveState.status === 'success' && (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Page content saved
                </span>
              )}
              {saveState.pageKey === activePage && saveState.status === 'error' && (
                <span className="text-red-600 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> Error saving page content
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState.pageKey === activePage && saveState.status === 'saving'}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {saveState.pageKey === activePage && saveState.status === 'saving'
                ? 'Saving...'
                : <><Save size={18} /> Save Vision Page</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
