import { FC, useState, useEffect } from "react";

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
      toast.error("Email is required to generate the link.");
      return;
    }

    if (!isActive) {
      toast.warning("Please login to view seeker details.");
      router.push("/Login");
      return;
    }

    if (!isProfileBuild) {
      toast.warning("Please build your profile first before viewing seeker details.");
      router.push("/Landing");
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
      toast.error("Failed to copy link. Please try again.");
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
