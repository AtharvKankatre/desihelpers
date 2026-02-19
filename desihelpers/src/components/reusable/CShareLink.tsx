import { FC, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import CButton from "../reusable/CButton";
import { useAuth } from "@/services/authorization/AuthContext";
import router from "next/router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type CCopyLinkButtonProps = {
  id?: string; // Optional prop
};

const CCopyLinkButton: FC<CCopyLinkButtonProps> = ({ id }) => {
  const { isProfileBuild, isActive } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullPath, setFullPath] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint for mobile view
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCopyLink = async () => {
    if (!id) {
      Swal.fire({
        title: "Error",
        text: "Email is required to generate the link.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view seeker details.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
      return;
    }

    if (!isProfileBuild) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please build your profile first before viewing seeker details.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
      return;
    }

    const generatedFullPath = `${process.env.NEXT_PUBLIC_Base_API_URL}user_profile/${id}`;
    setFullPath(generatedFullPath);

    try {
      await navigator.clipboard.writeText(fullPath);
      if (isMobile) {
        setShowModal(true);
      } else {
        toast.info(
          <div>
            <p style={{ fontWeight: "bold" }}>Link copied! Share via:</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <FacebookShareButton url={generatedFullPath}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={generatedFullPath}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={generatedFullPath}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <WhatsappShareButton url={generatedFullPath}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>,
          { position: "top-right", autoClose: 2000, hideProgressBar: true }
        );
      }
    } catch (err) {
      console.error("Failed to copy path to clipboard:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to copy link. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div
        onClick={handleCopyLink}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/icon_share.svg"
          alt="Copy Link"
          style={{
            height: "24px",
            width: "24px",
            marginLeft: "20px",
            marginTop: "15px",
          }}
        />
      </div>

      {/* Modal for mobile view */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Link Copied</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontWeight: "bold" }}>Share via:</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <FacebookShareButton url={fullPath}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={fullPath}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={fullPath}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={fullPath}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CCopyLinkButton;
