import { CH4Label } from "@/components/reusable/labels/CH4Label";
import { CH6Label } from "@/components/reusable/labels/CH6Label";
import { useAuth } from "@/services/authorization/AuthContext";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import style from "@/styles/Common.module.css";
import styles from "@/styles/UserProfiles.module.css";
import { BsInfoCircle } from "react-icons/bs";

function GuidelinesModal() {
  const { isSeeker } = useAuth();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Info icon to trigger modal */}
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip-info">Click to view guidelines</Tooltip>}
      >
        {/* Wrap with a div or use a single element */}
        <div>
          <BsInfoCircle className={` ${styles.infoIcon}`} onClick={handleShow} />
        </div>
      </OverlayTrigger>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Guidelines to Build Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 d-flex justify-content-center">
            <CH4Label
              className={style.pLabel}
              label={
                !isSeeker
                  ? "Follow the following steps to become a service provider"
                  : "Follow the following steps to add service provider skills set"
              }
            />
          </div>

          <div className="mb-4 ">
            <CH4Label
              label={
                isSeeker ? (
                  <>
                    <div className={styles.stepsWrapper}>
                    <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 1"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">Login</Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_login 1.svg"
                            alt="login Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Login"} />
                      </div>

                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
           
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 2"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">Build Profile</Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_user.svg"
                            alt="Build Profile Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Build Profile"} />
                      </div>

                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />

                      {/* Step 2 */}
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 3"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Save</Tooltip>}
                        >
                          <img
                            src="/assets/icons/icon_thumb.svg"
                            alt="Save Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Save"} />
                      </div>
                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />

                      <div style={{ textAlign: "center" }}>
                        <CH6Label className="fw-bold" label={"Step 4"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">
                              Add Your Skills
                            </Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_skillset.svg"
                            alt="Add Skills Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label  label={"Add Your Skills"} />
                      </div>
                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
                      <div style={{ textAlign: "center" }}>
                        <CH6Label className="fw-bold" label={"Step 5"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Save</Tooltip>}
                        >
                          <img
                            src="/assets/icons/icon_thumb.svg"
                            alt="Save Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Save"} />
                      </div>

                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.stepsWrapper}>
                    <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 1"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">Login</Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_login 1.svg"
                            alt="login Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Login"} />
                      </div>

                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
          
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 2"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">Build Profile</Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_user.svg"
                            alt="Build Profile Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Build Profile"} />
                      </div>

                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />

                      {/* Step 2 */}
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 3"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Save</Tooltip>}
                        >
                          <img
                            src="/assets/icons/icon_thumb.svg"
                            alt="Save Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Save"} />
                      </div>

                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />

                      {/* Step 3 */}
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 4"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">Become a Service Provider</Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_become_seeker_btn.svg"
                            alt="Become a Service Provider"
                            className={styles.infoIconsButton}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Become a Service Provider"} />
                      </div>
                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
                      <div style={{ textAlign: "center" }}>
                        <CH6Label className="fw-bold" label={"Step 5"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Confirm</Tooltip>}
                        >
                          <img
                            src="/assets/icons/icon_thumb.svg"
                            alt="Save Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Confirm"} />
                      </div>
                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
                      <div style={{ textAlign: "center" }}>
                        <CH6Label className="fw-bold" label={"Step 6"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={
                            <Tooltip id="tooltip-top">
                              Add Your Skills
                            </Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_skillset.svg"
                            alt="Add Skills Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Add Your Skills"} />
                      </div>
                      <img
                        src="/assets/icons/icon_arrowhead_right.svg"
                        alt=""
                        className={styles.infoIconsArrow}
                      />
                      <div style={{ textAlign: "center" }}>
                        <CH6Label className="fw-bold" label={"Step 7"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Save</Tooltip>}
                        >
                          <img
                            src="/assets/icons/icon_thumb.svg"
                            alt="Save Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Save"} />
                      </div>

                      {/* Repeat the above structure for the other steps */}
                    </div>
                  </>
                )
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GuidelinesModal;
