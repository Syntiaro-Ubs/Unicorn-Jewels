import { useEffect, useState } from 'react';
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

const fieldLabelClass = 'text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em] ml-1';
const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm';
const textareaClass = `${inputClass} resize-none`;

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

      <div className="grid gap-4 xl:grid-cols-[220px,1fr] items-start">
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

          {error && <p className="text-xs text-red-600 font-medium px-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function HomeSectionsManagement({ giftGuideSection, onEditGiftGuideSection }) {
  const [sectionContent, setSectionContent] = useState(() => cloneContent(defaultPageContent['home-vision-section']));
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState(null);
  const [uploadingFields, setUploadingFields] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  useEffect(() => {
    const fetchHomeVisionSection = async () => {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/content/page-content/home-vision-section');
        if (!response.ok) {
          throw new Error('Failed to fetch home vision section');
        }

        const data = await response.json();
        setSectionContent(mergeWithDefaults(defaultPageContent['home-vision-section'], data));
      } catch (error) {
        console.error('Error fetching homepage section content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeVisionSection();
  }, []);

  const updateField = (field, value) => {
    setSectionContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveState('saving');

    try {
      const response = await fetch('http://localhost:5000/api/content/page-content/home-vision-section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionContent)
      });

      if (!response.ok) {
        throw new Error('Failed to save homepage section');
      }

      setSaveState('success');
      setTimeout(() => setSaveState((current) => current === 'success' ? null : current), 1800);
    } catch (error) {
      console.error('Error saving homepage section:', error);
      setSaveState('error');
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
      console.error('Error uploading homepage section image:', error);
      setUploadErrors((prev) => ({
        ...prev,
        [uploadKey]: 'Upload failed. Please try again.'
      }));
    } finally {
      setUploadingFields((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading homepage sections...</p>
        </div>
      ) : (
        <>
          <div className="p-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h5 className="text-lg text-slate-900">Our Vision Home Section</h5>
                  <p className="text-sm text-slate-500 mt-1">
                    Edit the dark editorial block on the homepage, including its copy, button label, and primary image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Eyebrow</label>
                    <input
                      type="text"
                      value={sectionContent.eyebrow}
                      onChange={(e) => updateField('eyebrow', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={fieldLabelClass}>Title Line</label>
                      <input
                        type="text"
                        value={sectionContent.title_line_one}
                        onChange={(e) => updateField('title_line_one', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={fieldLabelClass}>Accent Word</label>
                      <input
                        type="text"
                        value={sectionContent.accent}
                        onChange={(e) => updateField('accent', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Primary Paragraph</label>
                    <textarea
                      rows={5}
                      value={sectionContent.paragraph_one}
                      onChange={(e) => updateField('paragraph_one', e.target.value)}
                      className={textareaClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Secondary Paragraph</label>
                    <textarea
                      rows={4}
                      value={sectionContent.paragraph_two}
                      onChange={(e) => updateField('paragraph_two', e.target.value)}
                      className={textareaClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Button Text</label>
                    <input
                      type="text"
                      value={sectionContent.button_text}
                      onChange={(e) => updateField('button_text', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <ManagedImageField
                    label="Primary Image"
                    value={sectionContent.primary_image_url}
                    uploadKey="home-vision-primary-image"
                    helperText="This is the main portrait image on the left side of the section."
                    uploading={!!uploadingFields['home-vision-primary-image']}
                    error={uploadErrors['home-vision-primary-image']}
                    onChange={(value) => updateField('primary_image_url', value)}
                    onUpload={(file) => handleImageUpload(file, 'home-vision-primary-image', (imageUrl) => {
                      updateField('primary_image_url', imageUrl);
                    })}
                    onRemove={() => updateField('primary_image_url', '')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-h-[20px]">
              {saveState === 'success' && (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Homepage section saved
                </span>
              )}
              {saveState === 'error' && (
                <span className="text-red-600 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> Error saving homepage section
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Saving...' : <><Save size={18} /> Save Our Vision Section</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
