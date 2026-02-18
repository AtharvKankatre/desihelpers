import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";

interface JobSeekerModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  userId: string | null;
}

const JobSeekerModal: React.FC<JobSeekerModalProps> = ({ show, onClose, onConfirm, userId }) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (userId) {
      setLoading(true);
      try {
        // Make API call to update job seeker status
          await ApiService.crud(APIDetails.AdminUpdateSeekerStatus,userId,JSON.stringify({ isJobSeeker : true }));
        onConfirm(userId); // Trigger the onConfirm callback
        onClose(); // Close the modal after confirmation
      } catch (error) {
        console.error("Error updating service provider status", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Service Provider Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to make them service provider?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : "Yes,make them service provider"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobSeekerModal;
