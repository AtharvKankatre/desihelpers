import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Spinner, Badge } from "react-bootstrap";
import { FaBlog, FaTimes, FaImage, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import style from "@/styles/Admin.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { toast } from "react-toastify";

interface BlogData {
  id?: number;
  title: string;
  category: string;
  date: string;
  description: string;
  content: string;
  image: string;
  tags: string[];
}

interface AdminBlogModalProps {
  show: boolean;
  handleClose: () => void;
  onSaved: () => void;
  editBlog?: BlogData | null;
}

const CATEGORIES = ["ARTICLES", "GUIDES", "NEWS", "COMMUNITY", "TIPS"];

const AdminBlogModal: React.FC<AdminBlogModalProps> = ({
  show,
  handleClose,
  onSaved,
  editBlog,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ARTICLES");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editBlog) {
      setTitle(editBlog.title || "");
      setCategory(editBlog.category || "ARTICLES");
      setDate(editBlog.date || "");
      setDescription(editBlog.description || "");
      setContent(editBlog.content || "");
      setImage(editBlog.image || "");
      setTags(editBlog.tags || []);
      setImagePreview(editBlog.image || null);
    } else {
      resetForm();
    }
  }, [editBlog, show]);

  const resetForm = () => {
    setTitle("");
    setCategory("ARTICLES");
    setDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    setDescription("");
    setContent("");
    setImage("");
    setTags([]);
    setTagInput("");
    setImagePreview(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `blog-images/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const result = await ApiService.crud(APIDetails.uploadImages, [file, fileName]);
      if (typeof result === "string") {
        setImage(result);
        toast.success("Image uploaded successfully!");
      } else if (result && result[1]) {
        setImage(result[1]);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. You can also paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    setSaving(true);
    try {
      // Auto-convert plain text to HTML paragraphs
      const htmlContent = content.trim()
        .split(/\n\n+/)  // split by blank lines into paragraphs
        .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
        .join('\n');

      const blogData: BlogData = {
        title: title.trim(),
        category,
        date,
        description: description.trim(),
        content: htmlContent,
        image: image || "/newassets/card1.png",
        tags,
      };

      const url = editBlog?.id
        ? `/api/blogs/${editBlog.id}`
        : `/api/blogs`;
      const method = editBlog?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        toast.success(
          editBlog?.id ? "Blog updated successfully!" : "Blog created successfully!"
        );
        resetForm();
        onSaved();
        handleClose();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      contentClassName={style.adminModalContent}
      dialogClassName={style.blogModalDialog}
    >
      <div className={style.adminModalHeader}>
        <h5 className={style.adminModalTitle}>
          <span className={style.adminModalTitleIcon}>
            <FaBlog color="#06b9a3" size={18} />
          </span>
          {editBlog?.id ? "Edit Blog Post" : "Create New Blog Post"}
        </h5>
        <button className={style.adminModalCloseBtn} onClick={handleClose}>
          <FaTimes />
        </button>
      </div>

      <div className={style.adminModalBody} style={{ maxHeight: "62vh", overflowY: "auto", padding: "12px 16px 6px" }}>
        {/* Image Upload Section */}
        <div className={style.blogImageUploadSection}>
          <label className={style.adminModalLabel}>Cover Image</label>
          <div
            className={style.blogImageDropzone}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className={style.blogImagePreviewWrapper}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={style.blogImagePreview}
                />
                <div className={style.blogImageOverlay}>
                  {uploading ? (
                    <Spinner animation="border" size="sm" variant="light" />
                  ) : (
                    <span>Click to change</span>
                  )}
                </div>
              </div>
            ) : (
              <div className={style.blogImagePlaceholder}>
                {uploading ? (
                  <Spinner animation="border" variant="secondary" />
                ) : (
                  <>
                    <FaImage size={20} color="#94a3b8" />
                    <span>Click to upload cover image</span>
                    <small>PNG, JPG, WEBP up to 5MB</small>
                  </>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {/* Or paste URL */}
          <Form.Control
            type="text"
            placeholder="Or paste image URL here..."
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              setImagePreview(e.target.value);
            }}
            className={`${style.adminModalInput} mt-2`}
            style={{ fontSize: "0.8rem", padding: "6px 10px" }}
          />
        </div>

        {/* Title */}
        <Form.Group className="mb-2 mt-2">
          <Form.Label className={style.adminModalLabel} style={{ fontSize: "0.8rem" }}>Blog Title *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a compelling blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={style.adminModalInput}
            style={{ padding: "6px 10px", fontSize: "0.85rem" }}
          />
        </Form.Group>

        {/* Category & Date Row */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Group className="mb-2" style={{ flex: 1 }}>
            <Form.Label className={style.adminModalLabel} style={{ fontSize: "0.8rem" }}>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={style.adminModalInput}
              style={{ padding: "6px 10px", fontSize: "0.85rem" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2" style={{ flex: 1 }}>
            <Form.Label className={style.adminModalLabel} style={{ fontSize: "0.8rem" }}>Date</Form.Label>
            <Form.Control
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={style.adminModalInput}
              style={{ padding: "6px 10px", fontSize: "0.85rem" }}
            />
          </Form.Group>
        </div>

        {/* Short Description */}
        <Form.Group className="mb-2">
          <Form.Label className={style.adminModalLabel} style={{ fontSize: "0.8rem" }}>
            Short Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Brief summary that appears on the blog card..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={style.adminModalInput}
            style={{ resize: "vertical", padding: "6px 10px", fontSize: "0.85rem" }}
          />
        </Form.Group>

        {/* Full Content */}
        <Form.Group className="mb-2">
          <Form.Label className={style.adminModalLabel} style={{ fontSize: "0.8rem" }}>
            Full Blog Content
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Write your full blog content here. Use blank lines to separate paragraphs..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={style.adminModalInput}
            style={{ resize: "vertical", padding: "6px 10px", fontSize: "0.85rem" }}
          />
        </Form.Group>

        {/* Tags */}
        <Form.Group className="mb-3">
          <Form.Label className={style.adminModalLabel}>Tags</Form.Label>
          <div className={style.blogTagsContainer}>
            {tags.map((tag) => (
              <Badge
                key={tag}
                className={style.blogTag}
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} <FaTimes size={10} style={{ marginLeft: 4 }} />
              </Badge>
            ))}
            <input
              type="text"
              placeholder="Add tag & press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className={style.blogTagInput}
            />
          </div>
        </Form.Group>
      </div>

      <div className={style.adminModalFooter}>
        <button className={style.adminModalCancelBtn} onClick={handleClose}>
          Cancel
        </button>
        <button
          className={style.adminModalSubmitBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <FaSave size={14} />
              {editBlog?.id ? "Update Blog" : "Publish Blog"}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default AdminBlogModal;
