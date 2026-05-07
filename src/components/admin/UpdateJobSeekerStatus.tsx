import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";

interface JobSeekerModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (userId: string, listProfileAs: string) => void;
  userId: string | null;
  currentListProfileAs?: string | null;
}

const profileOptions = [
  { value: "Job Seeker", label: "Job Seeker", color: "#e8f5e9", border: "#43a047" },
  { value: "Service Provider", label: "Service Provider", color: "#e3f2fd", border: "#1e88e5" },
  { value: "Both", label: "Both", color: "#fff3e0", border: "#fb8c00" },
];

const JobSeekerModal: React.FC<JobSeekerModalProps> = ({ show, onClose, onConfirm, userId, currentListProfileAs }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("Both");

  useEffect(() => {
    if (show) {
      setSelectedProfile(currentListProfileAs || "Both");
    }
  }, [show, currentListProfileAs]);

  const handleConfirm = async () => {
    if (userId) {
      setLoading(true);
      try {
        const isJobSeeker = selectedProfile !== "Job Seeker";
        await ApiService.crud(
          APIDetails.AdminUpdateSeekerStatus,
          userId,
          JSON.stringify({ isJobSeeker, listProfileAs: selectedProfile })
        );
        onConfirm(userId, selectedProfile);
        onClose();
      } catch (error) {
        console.error("Error updating profile status", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "1px solid #e8ecf1" }}>
        <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700, color: "#073157" }}>
          {currentListProfileAs ? "Change Profile Type" : "Set Profile Type"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "24px" }}>
        <p style={{ fontSize: "0.92rem", color: "#5a6a7d", marginBottom: "18px" }}>
          Select how this user should be listed:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {profileOptions.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: selectedProfile === opt.value ? `2px solid ${opt.border}` : "1.5px solid #e2e8f0",
                backgroundColor: selectedProfile === opt.value ? opt.color : "#fff",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="radio"
                name="listProfileAs"
                value={opt.value}
                checked={selectedProfile === opt.value}
                onChange={() => setSelectedProfile(opt.value)}
                style={{ accentColor: opt.border, width: "18px", height: "18px" }}
              />
              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a2a3a" }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "1px solid #e8ecf1", padding: "14px 24px" }}>
        <Button
          variant="secondary"
          onClick={onClose}
          style={{ borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          style={{
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.88rem",
            backgroundColor: "#073157",
            border: "none",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobSeekerModal;
