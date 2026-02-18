import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "@/styles/Common.module.css";
import jobStyles from "@/styles/ViewAllJobs.module.css";
import profileStyles from "@/styles/Profile.module.css"; // Added to use profile-specific modal styles
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";

// Define interface for Sample Seeker to match ViewAllJobs data
// Define interface for Sample Seeker to match ViewAllJobs data + Profile Screenshot fields
interface SampleSeeker {
    id: string;
    name: string;
    rating: number;
    photo: string;
    bio: string;
    city: string;
    state: string; // Added
    country: string;
    zipCode: string; // Added
    addressLine1: string; // Added
    addressLine2: string; // Added
    languages: string[];
    services: string[];
    dietary: string; // Added
    commute: string; // Added
    pets: string; // Added
    experience: number; // Added
}

interface PageProps {
    seeker: SampleSeeker | null;
}

const SeekerProfilePage = ({ seeker }: PageProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'services' | 'jobs' | 'testimonials' | 'gallery'>('services');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);

    // State for Testimonials
    const [jobs, setJobs] = useState<any[]>([]); // State for Jobs
    const [testimonials, setTestimonials] = useState([
        { id: "1", text: "Great experience working with " + (seeker?.name.split(" ")[0] || "them") + "! She was very professional and helpful.", author: "John Doe", rating: 5 },
        { id: "2", text: "Highly recommended for anyone looking for reliable services.", author: "Sarah L.", rating: 4 }
    ]);
    const [modalRating, setModalRating] = useState(0);

    if (!seeker) {
        return (
            <div className="container p-5 text-center">
                <h2>Seeker Not Found</h2>
                <button className="btn btn-secondary mt-3" onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    // Fetch testimonials
    useEffect(() => {
        if (seeker?.id) {
            fetchFeedback(seeker.id);
            fetchJobs(seeker.id);
        }
    }, [seeker?.id]);

    const fetchJobs = async (id: string) => {
        try {
            const res = await ApiService.crud(APIDetails.getJobsByUser, id);
            if (Array.isArray(res)) {
                setJobs(res);
            }
        } catch (e) {
            console.error("Error fetching jobs:", e);
        }
    };

    const fetchFeedback = async (id: string) => {
        try {
            // Check crud logic: api[0] + data. Data is ID.
            const res = await ApiService.crud(APIDetails.getFeedback, id);
            // Expecting array
            if (Array.isArray(res)) {
                const mapped = res.map((f: any) => ({
                    id: f._id,
                    text: f.feedback,
                    author: f.reviewerName || "Anonymous",
                    rating: f.rating
                }));
                setTestimonials(mapped);
            }
        } catch (e) {
            console.error("Error fetching feedback:", e);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                seekerId: seeker.id,
                rating: modalRating,
                feedback: feedback,
                reviewerName: "Guest User" // Should get real name if logged in
            };

            let res;
            if (editingFeedbackId) {
                res = await ApiService.crud(APIDetails.updateFeedback, editingFeedbackId, payload);
            } else {
                res = await ApiService.crud(APIDetails.postFeedback, payload);
            }

            if (res) {
                // Refresh list
                await fetchFeedback(seeker.id);
                handleCloseModal();
                alert(editingFeedbackId ? "Feedback updated successfully!" : "Feedback submitted successfully!");
            } else {
                alert("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred.");
        }
    };

    const handleEditFeedback = (item: any) => {
        setFeedback(item.text);
        setModalRating(item.rating);
        setEditingFeedbackId(item.id);
        setShowFeedbackModal(true);
    };

    const handleDeleteFeedback = async (id: string) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;
        try {
            const res = await ApiService.crud(APIDetails.deleteFeedback, id);
            if (res) {
                await fetchFeedback(seeker.id);
                alert("Feedback deleted successfully!");
            } else {
                alert("Failed to delete feedback.");
            }
        } catch (e) {
            console.error("Error deleting feedback:", e);
            alert("Error deleting feedback.");
        }
    };

    const handleCloseModal = () => {
        setShowFeedbackModal(false);
        setFeedback("");
        setModalRating(0);
        setEditingFeedbackId(null);
    };

    return (
        <>
            <Head>
                <title>{seeker.name} - Profile</title>
            </Head>

            <div className={`container-fluid ${styles.displayDetailsWrapper} py-5`} style={{ backgroundColor: '#f4f7fb', minHeight: '100vh' }}>
                <div className="container">

                    {/* Back Button */}
                    <div className="mb-3">
                        <button
                            onClick={() => router.back()}
                            className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                            style={{ color: '#001838', fontWeight: '600' }}
                        >
                            <span className="me-2" style={{ fontSize: '1.2rem' }}>←</span> Back to Seekers
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* LEFT COLUMN: Sidebar (About, Address) */}
                        <div className="col-md-4">
                            {/* About Me Card */}
                            <div className="card border-0 mb-4" style={{ borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold m-0" style={{ color: '#f07c00' }}>About Me</h5>
                                    </div>
                                    <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                                        {seeker.bio}
                                    </p>

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>LANGUAGES SPOKEN</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.languages.join(", ")}</div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>DIETARY PREFERENCE</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.dietary}</div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>COMMUTE PREFERENCE</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.commute}</div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>OK WITH PETS</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.pets}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Details Card */}
                            <div className="card border-0" style={{ borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold m-0" style={{ color: '#f07c00' }}>Address Details</h5>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>ADDRESS LINE 1</small>
                                        <div className="text-dark fw-bold small mt-1">{seeker.addressLine1}</div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>ADDRESS LINE 2</small>
                                        <div className="text-dark fw-bold small mt-1">{seeker.addressLine2}</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>CITY</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.city}</div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>STATE</small>
                                            <div className="text-dark fw-bold small mt-1">{seeker.state}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px' }}>ZIP CODE</small>
                                        <div className="text-dark fw-bold small mt-1">{seeker.zipCode}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Tabs & Content */}
                        <div className="col-md-8">
                            <div className="card border-0" style={{ borderRadius: '12px', minHeight: '600px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <div className="card-header bg-white border-bottom-0 pb-0 pt-4 px-4">
                                    <div className="d-flex justify-content-between align-items-center border-bottom">
                                        <div className="d-flex gap-4">
                                            <div
                                                className={`pb-3 px-1 cursor-pointer ${activeTab === 'services' ? 'fw-bold text-dark' : 'text-muted'}`}
                                                onClick={() => setActiveTab('services')}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    borderBottom: activeTab === 'services' ? '3px solid #f07c00' : 'none'
                                                }}
                                            >
                                                Services Provided
                                            </div>
                                            <div
                                                className={`pb-3 px-1 cursor-pointer ${activeTab === 'jobs' ? 'fw-bold text-dark' : 'text-muted'}`}
                                                onClick={() => setActiveTab('jobs')}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    borderBottom: activeTab === 'jobs' ? '3px solid #f07c00' : 'none'
                                                }}
                                            >
                                                Jobs Offered by Me
                                            </div>
                                            <div
                                                className={`pb-3 px-1 cursor-pointer ${activeTab === 'testimonials' ? 'fw-bold text-dark' : 'text-muted'}`}
                                                onClick={() => setActiveTab('testimonials')}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    borderBottom: activeTab === 'testimonials' ? '3px solid #f07c00' : 'none'
                                                }}
                                            >
                                                Testimonials
                                            </div>
                                            <div
                                                className={`pb-3 px-1 cursor-pointer ${activeTab === 'gallery' ? 'fw-bold text-dark' : 'text-muted'}`}
                                                onClick={() => setActiveTab('gallery')}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    borderBottom: activeTab === 'gallery' ? '3px solid #f07c00' : 'none'
                                                }}
                                            >
                                                Photo Gallery
                                            </div>
                                        </div>

                                        {/* Dynamic Action Button based on Active Tab */}
                                        <button
                                            type="button"
                                            className="btn btn-link fw-bold pb-3 text-decoration-none border-0 bg-transparent p-0 d-flex align-items-center gap-2"
                                            style={{ color: '#f07c00', fontSize: '14px', boxShadow: 'none' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (activeTab === 'testimonials') {
                                                    console.log("Add Feedback clicked");
                                                    setEditingFeedbackId(null);
                                                    setFeedback("");
                                                    setModalRating(0);
                                                    setShowFeedbackModal(true);
                                                } else if (activeTab === 'services') {
                                                    alert("Add Services Clicked (Placeholder)");
                                                } else if (activeTab === 'jobs') {
                                                    alert("Add Jobs Clicked (Placeholder)");
                                                } else if (activeTab === 'gallery') {
                                                    alert("Add Photos Clicked (Placeholder)");
                                                }
                                            }}
                                        >
                                            <span>+ Add {activeTab === 'services' ? 'Services' : activeTab === 'jobs' ? 'Jobs' : activeTab === 'testimonials' ? 'Feedback' : 'Photos'}</span>
                                            {/* Edit Icon */}
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body p-4">
                                    {activeTab === 'services' && (
                                        <div className="d-flex flex-column gap-3">
                                            {seeker.services.map((svc, i) => (
                                                <div key={i} className="border-bottom pb-4 mb-2 ps-3">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <div className="rounded bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                                            {/* Placeholder Icon */}
                                                            <span className="text-muted">⚡</span>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-1">{svc}</h6>
                                                            {/* Mock Category/Details */}
                                                        </div>
                                                    </div>
                                                    <div className="row g-4">
                                                        <div className="col-4">
                                                            <small className="text-uppercase text-muted" style={{ fontSize: '10px' }}>CATEGORY</small>
                                                            <div className="text-dark fw-bold small">Professionals</div>
                                                        </div>
                                                        <div className="col-4">
                                                            <small className="text-uppercase text-muted" style={{ fontSize: '10px' }}>EXPERIENCE</small>
                                                            <div className="text-dark fw-bold small">{seeker.experience} Years</div>
                                                        </div>
                                                        <div className="col-4">
                                                            <small className="text-uppercase text-muted" style={{ fontSize: '10px' }}>AVAILABLE</small>
                                                            <div className="text-dark fw-bold small">Yes</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <span className="small text-danger cursor-pointer">Show More...</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'jobs' && (
                                        <div className="d-flex flex-column gap-3">
                                            {jobs.length > 0 ? (
                                                jobs.map((job) => (
                                                    <div key={job._id} className={jobStyles.jobCard}>
                                                        {/* Top Row: Date/Posted By + Price */}
                                                        <div className={jobStyles.cardTopRow}>
                                                            <div className={jobStyles.cardPostedBy}>
                                                                Posted by <strong>{seeker.name}</strong> • {new Date(job.createdAt).toLocaleDateString()}
                                                            </div>
                                                            <div className={jobStyles.cardPrice}>
                                                                {job.pay} <span className={jobStyles.cardPriceUnit}>/hr</span>
                                                            </div>
                                                        </div>

                                                        {/* Title Row */}
                                                        <div className={jobStyles.cardTitleRow}>
                                                            <h4 className={jobStyles.cardJobTitle} style={{ fontSize: '18px' }}>
                                                                {job.title}
                                                                {job.isUrgent && <span className={jobStyles.cardUrgentStar}>★ Urgent</span>}
                                                            </h4>
                                                        </div>

                                                        {/* Details */}
                                                        <div className={jobStyles.cardDetails}>
                                                            <div className={jobStyles.cardDetailItem}>
                                                                <strong>Location:</strong> {job.location}
                                                            </div>
                                                            <div className={jobStyles.cardDetailItem}>
                                                                <strong>Type:</strong> {job.type}
                                                            </div>
                                                            <div className="text-muted small mt-2">
                                                                {job.description?.substring(0, 150)}...
                                                            </div>
                                                        </div>

                                                        {/* Tags */}
                                                        <div className={`${jobStyles.cardTags} mt-2`}>
                                                            <span className={jobStyles.cardTag}>{job.type}</span>
                                                            {job.isUrgent && <span className={jobStyles.cardTagMore}>Urgent</span>}
                                                        </div>

                                                        {/* Footer */}
                                                        <div className={jobStyles.cardFooter}>
                                                            <span className={jobStyles.cardViewDetails} onClick={() => router.push(`/jobs/${job._id}`)}>
                                                                View Details →
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-5 text-muted">
                                                    <p>No jobs offered by {seeker.name} yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'testimonials' && (
                                        <div className="d-flex flex-column gap-3">
                                            {testimonials.map((t) => (
                                                <div key={t.id} className="p-3 bg-white border rounded position-relative">
                                                    <p className="mb-2 text-dark fst-italic">"{t.text}"</p>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-bold text-dark small">- {t.author}</span>
                                                        <div className="text-warning small">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span key={star} style={{ color: star <= t.rating ? "#f07c00" : "#ddd" }}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
                                                        <button
                                                            className="btn btn-sm btn-link p-0 me-2 text-muted"
                                                            onClick={() => handleEditFeedback(t)}
                                                            title="Edit"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-link p-0 text-danger"
                                                            onClick={() => handleDeleteFeedback(t.id)}
                                                            title="Delete"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {testimonials.length === 0 && <p className="text-muted text-center">No testimonials yet.</p>}
                                        </div>
                                    )}

                                    {activeTab === 'gallery' && (
                                        <div className="text-center py-5 text-muted">
                                            <p>No photos added to gallery yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Custom Feedback Modal to ensure visibility */}
            {
                showFeedbackModal && (
                    <div className={profileStyles.modalOverlay} onClick={handleCloseModal}>
                        <div className={profileStyles.modalContainer} style={{ minWidth: '600px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                            <div className={profileStyles.modalHeader}>
                                <h2 className={profileStyles.modalTitle}>{editingFeedbackId ? "Edit Feedback" : "Testimonials"}</h2>
                                <button className={profileStyles.closeBtn} onClick={handleCloseModal}>×</button>
                            </div>

                            <div className={profileStyles.servicesModalActions} style={{ marginBottom: '10px' }}>
                                <p className={profileStyles.modalSubtitle}>
                                    Add/Delete testimonials to get listed on deshihelper
                                </p>
                                <div className={profileStyles.addServicesLink} onClick={() => {
                                    setEditingFeedbackId(null);
                                    setFeedback("");
                                    setModalRating(0);
                                }}>
                                    <span>+</span> Add Feedback
                                </div>
                            </div>

                            <div className="p-4 pt-2">
                                <Form onSubmit={handleFeedbackSubmit}>
                                    <div className="mb-4 p-3 rounded" style={{ border: '1px solid #eee', backgroundColor: '#fff' }}>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <Form.Label className="fw-bold fs-6 m-0" style={{ color: '#001838' }}>Rate Experience</Form.Label>
                                                <div className="d-flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className="cursor-pointer"
                                                            role="button"
                                                            onClick={() => setModalRating(star)}
                                                            style={{
                                                                color: star <= modalRating ? "#f07c00" : "#e0e0e0",
                                                                fontSize: '24px',
                                                                transition: 'color 0.2s',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Write your feedback here..."
                                                required
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    padding: '0',
                                                    resize: 'none',
                                                    fontSize: '14px',
                                                    boxShadow: 'none'
                                                }}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className={profileStyles.modalActions} style={{ marginTop: '20px' }}>
                                        <button type="button" className={profileStyles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className={profileStyles.updateBtn}>{editingFeedbackId ? "Update" : "Submit"}</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };

    // Sample seeker data matching ViewAllJobs.tsx + new Profile fields
    const sampleSeekers: SampleSeeker[] = [
        {
            id: "sk1",
            name: "Shrutika Patil",
            rating: 4.5,
            photo: "",
            bio: "Snaps by Shelley is a professional photography service that specializes in capturing memorable moments. Whether it's a wedding... Read more...",
            city: "Bhopal",
            state: "Madhya Pradesh",
            country: "India",
            zipCode: "462001",
            addressLine1: "123 Main St",
            addressLine2: "Apt 4B",
            languages: ["English", "Hindi", "Marathi"],
            services: ["Music teacher", "Event planning", "Photography Services"],
            dietary: "Veg, Non-Veg",
            commute: "Have a ride",
            pets: "No",
            experience: 15
        },
        // ... (other samples can simply use defaults or copy structure)
        {
            id: "sk2",
            name: "Dipali Khedekar",
            rating: 4,
            photo: "",
            bio: "Dedicated professional with years of experience.",
            city: "Pune",
            state: "Maharashtra",
            country: "India",
            zipCode: "411001",
            addressLine1: "45 Pune Rd",
            addressLine2: "",
            languages: ["English", "Marathi", "Hindi"],
            services: ["Music teacher"],
            dietary: "Veg",
            commute: "Public Transport",
            pets: "Yes",
            experience: 5
        },
        { id: "sk3", name: "Amit More", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", state: "Madhya Pradesh", country: "India", zipCode: "462001", addressLine1: "789 Park Ave", addressLine2: "", languages: ["Hindi"], services: ["Music teacher", "Event planning"], dietary: "Non-Veg", commute: "Walk", pets: "No", experience: 8 },
        { id: "sk4", name: "Neelam Mane", rating: 4.5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", state: "Madhya Pradesh", country: "India", zipCode: "462001", addressLine1: "101 Garden Rd", addressLine2: "Suite 200", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"], dietary: "Veg", commute: "Car", pets: "Yes", experience: 12 },
        { id: "sk5", name: "Abhishek Bajaj", rating: 5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", state: "Madhya Pradesh", country: "India", zipCode: "462001", addressLine1: "222 Lake View", addressLine2: "", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"], dietary: "Veg", commute: "Public Transport", pets: "No", experience: 10 },
        { id: "sk6", name: "Priya Sharma", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Delhi", state: "Delhi", country: "India", zipCode: "110001", addressLine1: "333 River St", addressLine2: "Flat 5", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"], dietary: "Non-Veg", commute: "Have a ride", pets: "Yes", experience: 7 },
    ];

    const seeker = sampleSeekers.find(s => s.id === id) || sampleSeekers[0]; // Fallback to first if not found for demo

    if (!seeker) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            seeker,
        },
    };
};

export default SeekerProfilePage;
