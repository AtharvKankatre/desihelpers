import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { FunctionComponent, useEffect, useState } from "react";
import { Button, Card, Col, Row, Modal } from "react-bootstrap";
import { SlSizeFullscreen } from "react-icons/sl";
import { getWorkPhotoUrls } from "@/utils/s3Helper"; // Import the helper function

type Props = {
  workPhotos: string[]; // S3 paths instead of direct URLs
};

export const CUserWorkPhotos: FunctionComponent<Props> = ({ workPhotos }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [workPhotoUrls, setWorkPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const urls = getWorkPhotoUrls(bucketName, workPhotos);
      setWorkPhotoUrls(urls);
    };
  
    fetchPhotoUrls();
  }, [workPhotos]);
  

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(undefined);
  };

  return (
    <>
      <CExpandablePanel title="My Work" id="workPhotos" isExpanded="show">
        {workPhotoUrls.length === 0 ? (
          <p className="text-secondary">No images to preview</p>
        ) : (  <Row className="g-2">
            {workPhotoUrls.map((image: string, index: number) => (
              <Col xs={12} sm={3} key={index} className="mt-2 me-4">
                <Card>
                  <img
                    src={image}
                    alt={`Work photo ${index + 1}`}
                    className="card-img-top seekerPhoto"
                  />
                  <Card.Footer>
                    <Button variant="light" onClick={() => handleOpen(image)}>
                      <SlSizeFullscreen size={20} className="textPrimary " />
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>)}
      </CExpandablePanel>

      <Modal show={open} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Work Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Work Photo"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
