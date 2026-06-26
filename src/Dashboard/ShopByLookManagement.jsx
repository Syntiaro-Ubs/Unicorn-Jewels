import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Search,
  GripVertical,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";
import { API_BASE } from "@/config";

export default function ShopByLookManagement() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    variant: "",
    title: "",
    description: "",
    eyebrow: "Shop by Look",
    content_align: "left",
    image_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/content/shop-by-look`);
      const data = await response.json();
      if (response.ok || Array.isArray(data)) {
        setCards(data);
      }
    } catch (error) {
      console.error("Error fetching shop by look cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCard(null);
    setFormData({
      variant: "",
      title: "",
      description: "",
      eyebrow: "Shop by Look",
      content_align: "left",
      image_url: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditingCard(card);
    setFormData({
      variant: card.variant,
      title: card.title,
      description: card.description,
      eyebrow: card.eyebrow,
      content_align: card.content_align,
      image_url: card.image_url,
    });
    setSelectedFile(null);
    setPreviewUrl(
      card.image_url
        ? card.image_url.startsWith("http")
          ? card.image_url
          : `${API_BASE}${card.image_url}`
        : "",
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (variant) => {
    if (!window.confirm(`Are you sure you want to delete "${variant}" card?`))
      return;

    try {
      const response = await fetch(
        `${API_BASE}/api/content/shop-by-look/${variant}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
      if (response.ok) {
        fetchCards();
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("eyebrow", formData.eyebrow);
    submitData.append("content_align", formData.content_align);
    submitData.append("image_url", formData.image_url);
    if (selectedFile) {
      submitData.append("image", selectedFile);
    }

    try {
      const url = editingCard
        ? `${API_BASE}/api/content/shop-by-look/${editingCard.variant}`
        : `${API_BASE}/api/content/shop-by-look`;

      const method = editingCard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => {
          setSaveStatus(null);
          setIsModalOpen(false);
          fetchCards();
        }, 1500);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      setSaveStatus("error");
    }
  };

  const handleDragStart = (e, card) => {
    setDraggedItem(card);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetCard) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.variant === targetCard.variant) return;

    const draggedIndex = cards.findIndex((c) => c.variant === draggedItem.variant);
    const targetIndex = cards.findIndex((c) => c.variant === targetCard.variant);

    const newCards = [...cards];
    [newCards[draggedIndex], newCards[targetIndex]] = [
      newCards[targetIndex],
      newCards[draggedIndex],
    ];

    setCards(newCards);
    setDraggedItem(null);

    // Save order to backend
    try {
      const orderData = newCards.map((card, index) => ({
        variant: card.variant,
        display_order: index + 1,
      }));

      await fetch(`${API_BASE}/api/content/shop-by-look-order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ items: orderData }),
      });
    } catch (error) {
      console.error("Error updating order:", error);
      fetchCards(); // Revert on error
    }
  };

  const filteredCards = cards.filter(
    (c) =>
      (c.variant?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (c.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
            Shop by Look Cards
          </h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage and arrange your shop by look editorial cards.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus size={20} />
          Add New Card
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by variant or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCards.map((card) => (
            <div
              key={card.variant}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, card)}
              className="p-6 hover:bg-slate-50/50 transition-colors group cursor-move border-l-4 border-transparent hover:border-blue-500"
            >
              <div className="flex items-center gap-6">
                {/* Drag Handle */}
                <GripVertical size={18} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0" />

                {/* Preview Image */}
                <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                  <ImageWithFallback
                    src={
                      card.image_url
                        ? card.image_url.startsWith("http")
                          ? card.image_url
                          : `${API_BASE}${card.image_url}`
                        : ""
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                      {card.variant}
                    </span>
                    <span className="text-slate-500 text-xs">{card.eyebrow}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{card.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">Align:</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium capitalize">
                      {card.content_align}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEditModal(card)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(card.variant)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCards.length === 0 && (
            <div className="px-8 py-20 text-center text-slate-400 italic">
              {loading ? "Loading cards..." : "No cards found matching your search."}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingCard ? `Edit Card: ${editingCard.variant}` : "Add New Card"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSave}
                className="flex-1 overflow-y-auto p-8 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Variant */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Variant Key
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. sculptural, vault"
                        value={formData.variant}
                        onChange={(e) =>
                          setFormData({ ...formData, variant: e.target.value })
                        }
                        disabled={editingCard !== null}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. The Sculptural Edit"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                      />
                    </div>

                    {/* Eyebrow */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Eyebrow Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shop by Look"
                        value={formData.eyebrow}
                        onChange={(e) =>
                          setFormData({ ...formData, eyebrow: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                      />
                    </div>

                    {/* Content Alignment */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Content Alignment
                      </label>
                      <select
                        value={formData.content_align}
                        onChange={(e) =>
                          setFormData({ ...formData, content_align: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Card description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium resize-none"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Image
                      </label>
                      {previewUrl && (
                        <div className="w-full h-32 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 mb-3">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <Upload size={20} className="text-slate-400 group-hover:text-blue-600" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {saveStatus && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 ${
                      saveStatus === "success"
                        ? "bg-green-50 text-green-700"
                        : saveStatus === "error"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {saveStatus === "success" ? (
                      <>
                        <CheckCircle size={20} />
                        <span className="font-bold">Card saved successfully!</span>
                      </>
                    ) : saveStatus === "error" ? (
                      <>
                        <AlertCircle size={20} />
                        <span className="font-bold">Error saving card. Please try again.</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="font-bold">Saving...</span>
                      </>
                    )}
                  </div>
                )}
              </form>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                >
                  <Save size={18} />
                  Save Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
