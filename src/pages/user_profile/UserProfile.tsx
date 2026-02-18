import { FunctionComponent, useEffect, useState } from "react";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";
import { CH1Label } from "@/components/reusable/labels/CH1Label";
import withAuth from "@/services/authorization/ProfileService";
import { useRouter } from "next/router";
import { Routes } from "@/services/routes/Routes";
import commonStyles from "@/styles/Common.module.css";
import styles from "@/styles/UserProfiles.module.css";
import CButton from "@/components/reusable/CButton";
import { CPersonalDetails } from "@/components/page_related/user_profile/CPersonalDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import { CExperienceDetails } from "@/components/page_related/user_profile/CExperienceDetails";
import { CAboutMe } from "@/components/page_related/user_profile/CAboutMe";
import ChangePasswordModal from "@/components/page_related/user_profile/CChangePasswordModal";
import { CUserPhoto } from "@/components/page_related/user_profile/CUserPhoto";
import { CUserWorkPhotos } from "@/components/page_related/user_profile/CUserWorkPhotos";
import { CBecomeASeeker } from "@/components/page_related/user_profile/CBecomeASeeker";
import { CBecomeServiceProvider } from "@/components/page_related/user_profile/CBecomeServiceProvider";
import { CH4Label } from "@/components/reusable/labels/CH4Label";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { CWorkPhoto } from "@/components/page_related/user_profile/CWorkPhotoUpload";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import { CDisplay } from "@/components/reusable/CDisplay";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { Color } from "maplibre-gl";
import style from "@/styles/Common.module.css";
import { CH6Label } from "@/components/reusable/labels/CH6Label";
import Link from "next/link";
import React from "react";
import CCopyLinkButton from "@/components/reusable/CShareLink";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile: FunctionComponent = () => {
  const [onLoad, setOnload] = useState<boolean>(true);
  const [profile, setProfile] = useState<IUserProfileModel | null>(null);
  const router = useRouter();
  const { isSeeker, isProfileBuild } = useAuth();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [showSeekerModal, setShowSeekerModal] = useState<boolean>(false);
  const { mobile } = useAppMediaQuery();
  const { desktop } = useAppMediaQuery();

  useEffect(() => {
    const getProfile = async () => {
      var result = await ApiService.crud(APIDetails.getUserProfile);
      if (result[0] == true) {
        setProfile(result[1] as IUserProfileModel);
      }
      setOnload(false);
    };

    getProfile();

    return () => { };
  }, []);

  if (onLoad) {
    return <div>Loading....</div>;
  }

  const goToEditProfile = () => {
    let q: string = JSON.stringify(profile);
    router.push({ pathname: Routes.editUserProfile, query: { queryData: q } });
  };
  const goToSeekerProfile = () => {
    let q: string = JSON.stringify(profile);
    router.push({ pathname: Routes.editSeeekerForm, query: { queryData: q } });
  };

  const handleChangePasswordClose = () => {
    setChangePasswordModalOpen(false);
  };
  const handleChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
  };

  if (isProfileBuild == false) {
    return (
      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >
        <div
          className={`col-md-12 text-center ${commonStyles.profileMessageBox}`}
        >
          <p className="mt-2">
            <CH1Label label={`Welcome!`} />
          </p>
          <div className={`mt-4`}>
            <CH4Label
              label={`It seems like you haven't built your profile yet.`}
            />
          </div>
          <div className={`mb-4`}>
            <CH4Label
              label={`Click on "Build Your Profile" now to start your journey!`}
            />
          </div>

          <CButton
            className="mb-4"
            buttonClassName="btn btn-warning btn-lg"
            label="Build Your Profile"
            onClick={goToEditProfile}
          />

          <div className="mb-4">
            <CH4Label
              className={style.pLabel}
              label={
                isSeeker
                  ? "Follow the following steps to add your skills set"
                  : "Follow the following steps to become a service provider"
              }
            />
          </div>

          <div className="mb-4">
            <CH4Label
              label={
                isSeeker == true ? (
                  <>
                    <div className={styles.stepsWrapper}>
                      <div className={styles.step}>
                        <CH6Label className="fw-bold" label={"Step 1"} />
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus", "click"]}
                          overlay={<Tooltip id="tooltip-top">Login</Tooltip>}
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
                              Add your Skills
                            </Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_skillset.svg"
                            alt="Add Skills Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Add your Skills"} />
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

                      {/* Repeat the above structure for the other steps */}
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
                          overlay={<Tooltip id="tooltip-top">Login</Tooltip>}
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
                              Add your Skills
                            </Tooltip>
                          }
                        >
                          <img
                            src="/assets/icons/icon_skillset.svg"
                            alt="Add Skills Icon"
                            className={styles.infoIcons}
                          />
                        </OverlayTrigger>
                        <CH6Label label={"Add your Skills"} />
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
        </div>
      </div>
    );
  }

  function returnAddress() {
    return `${profile?.addressLine1 ?? "-"} ${profile?.addressLine2 ?? ""}, ${profile?.city ?? "-"
      }, ${profile?.state ?? "-"} - ${profile?.zipCode ?? "-"}`;
  }

  function returnLanguages() {
    return profile?.languagesSpoken == null
      ? ""
      : `${profile?.languagesSpoken.toString().split(",").join(", ")}`;
  }

  function returnAboutMe() {
    return (
      <div className={styles.scrollableDescription}>
        {profile?.aboutMe == null ? "-" : profile?.aboutMe.toString()}
      </div>
    );
  }

  if (desktop) {
    return (
      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >
        <div className="col-md-12">
          <div className={`container p-4 mb-4  ${styles.viewProfileMain}`}>
            <div className="row">
            <div className="col-md-4 d-flex ">
  <CH2Label label="My Profile" />
  {isSeeker === true && (
    <div className="ms-2">
      <CCopyLinkButton id={profile?._id || ""} />
    </div>
  )}
</div>

                <div className="col-md-8 col-sm-12 align-content-center text-end">

                  <div className="w-auto mb-2 float-end">
                    <CButton
                      buttonClassName="btn bgSecondary btn-sm text-light"
                      label="Change Password"
                      onClick={handleChangePasswordModal}
                    />
                  </div>

                  <div
                    className={`${
                      isProfileBuild ? "w-auto float-end" : "d-none"
                      }`}
                  > 
                    {isSeeker == true && profile?.jobDetails?.length == 0 ? (
                      <CButton
                        buttonClassName="btn btn-warning btn-sm"
                        label="Add Your Skills"
                        onClick={goToSeekerProfile}
                      />
                    ) : null}
                  </div>

                  <div
                    className={`${
                      isProfileBuild ? "w-auto float-end mb-2" : "d-none"
                      }`}
                  >
                    {isSeeker == true && profile?.jobDetails?.length != 0 ? (
                      <>
                        <CButton
                          buttonClassName="btn btn-warning btn-sm"
                          label="Edit Your Skills"
                          onClick={goToSeekerProfile}
                        />

                      </>
                    ) : null}
                  </div>
                 
                  <div
                    className={`${isProfileBuild ? "w-auto float-end" : "d-none"
                      }`}
                  >
                    <CButton
                      buttonClassName="btn btn-warning btn-sm"
                      label="Edit Profile"
                      onClick={goToEditProfile}
                    />         
                  </div>

                  <div className="w-auto float-end">
                    {isSeeker == false ? (
                      <CBecomeServiceProvider
                        showModal={showSeekerModal}
                        setShowModal={setShowSeekerModal}
                      />
                    ) : null}
                  </div>
                </div>
                <ToastContainer />
            </div>

            <Row className="mt-2 mb-4 modalImportantInfo pt-4">
              <Col sm={12} md={12}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="w-auto float-start pe-2">
                      <CUserPhoto
                        profile={profile!}
                        returnNewProfile={(e) => setProfile(e)}
                      />
                    </div>
                    <div className="w-auto mt-2">
                      <CH4Label label={profile?.firstName ?? "-"} />
                      <CDisplay
                        heading="Display Name"
                        hideIcon={true}
                        label={profile?.displayName ?? "-"}
                      />
                    </div>
                  </Col>
                  <Col sm={12} md={6} lg={8} className="mt-2">
                    <CDisplay
                      heading="Email"
                      icon="/assets/icons/form_icons/icon_email.svg"
                      label={profile?.email ?? "-"}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={12} className="mt-3">
                <Row>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Phone"
                      icon="/assets/icons/form_icons/icon_phone.svg"
                      label={profile?.phone ?? "-"}
                    />
                  </Col>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Whatsapp"
                      icon="/assets/icons/form_icons/icon_whatsapp.svg"
                      label={profile?.mobile ?? "-"}
                    />
                  </Col>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Show mobile on profile"
                      icon="/assets/icons/form_icons/icon_user_profile.svg"
                      label={profile?.showPhone == true ? "Yes" : "No"}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Languages Spoken"
                  icon="/assets/icons/form_icons/icon_languages_spoken.svg"
                  label={returnLanguages()}
                />
              </Col>
              <Col sm={12} md={8}>
                <CDisplay
                  heading="Address"
                  icon="/assets/icons/form_icons/icon_address.svg"
                  label={returnAddress()}
                />
              </Col>
            </Row>

            {isSeeker && (
              <Row>
                <Col sm={12} md={4}>
                  <CDisplay
                    heading="Commute Preference"
                    icon="/assets/icons/form_icons/icon_commute.svg"
                    label={`${profile?.commutePreference ?? "-"}`}
                  />
                </Col>
                <Col md={8}>
                  <Row>
                    <Col sm={12} md={6}>
                      <CDisplay
                        heading="Dietary Preference"
                        icon="/assets/icons/form_icons/icon_diet.svg"
                        label={`${profile?.dietaryRestrictions ?? "-"}`}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <CDisplay
                        heading="OK With Pets"
                        icon="/assets/icons/form_icons/icon_pets.svg"
                        label={`${
                          profile?.okWithPets == true
                            ? "Yes"
                            : profile?.okWithPets == false
                              ? "No"
                              : "Not mentioned"
                          }`}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}

            <Row>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Facebook"
                  icon="/assets/icons/form_icons/icon_facebook.svg"
                  label={
                    typeof profile?.facebookLink === "undefined" ||
                      profile?.facebookLink?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                        href={`${profile?.facebookLink!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                       Click to open link
                      </Link>
                    )
                  }
                />
              </Col>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Instagram"
                  icon="/assets/icons/form_icons/icon_instagram.svg"
                  label={
                    typeof profile?.instagram === "undefined" ||
                      profile?.instagram?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                        href={`${profile?.instagram!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                       Click to open link
                      </Link>
                    )
                  }
                />
              </Col>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Website"
                  icon="/assets/icons/form_icons/icon_website.svg"
                  label={
                    typeof profile?.websiteLink === "undefined" ||
                      profile?.websiteLink?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                      href={`${profile?.websiteLink!}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: "pointer" }}
                    >
                      Click to open link
                    </Link>
                    
                    )
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <CDisplay
                  heading="About Me"
                  icon="/assets/icons/form_icons/icon_dummy_user.svg"
                  label={returnAboutMe()}
                />
              </Col>
            </Row>

            {/* Show details on experience and other parameters */}
            {isSeeker && <CExperienceDetails profile={profile} />}

            {isSeeker && (
              <CUserWorkPhotos workPhotos={profile?.uploadPhotoOfWork ?? []} />
            )}
          </div>
          {/* Change Password Modal */}
          <ChangePasswordModal
            open={changePasswordModalOpen}
            handleClose={handleChangePasswordClose}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >
        <div className="col-md-12">
          <div className={`container p-4 mb-4  ${styles.viewProfileMain}`}>
            <div className="row">
              <div className="col-md-4">
                <CH2Label label="My Profile" />
              </div>

              <div className="col-md-8 col-sm-12 align-content-center text-end">
                <div className="w-auto mb-2 float-end">
                  <CButton
                    buttonClassName="btn bgSecondary btn-sm text-light"
                    label="Change Password"
                    onClick={handleChangePasswordModal}
                  />
                </div>

                <div
                  className={`${
                    isProfileBuild ? "w-auto float-end" : "d-none"
                    }`}
                >
                  {isSeeker == true && profile?.jobDetails?.length == 0 ? (
                    <CButton
                      buttonClassName="btn btn-warning btn-sm"
                      label="Add Your Skills"
                      onClick={goToSeekerProfile}
                    />
                  ) : null}
                </div>

                <div
                  className={`${
                    isProfileBuild ? "w-auto float-end" : "d-none"
                    }`}
                >
                  {isSeeker == true && profile?.jobDetails?.length != 0 ? (
                    <CButton
                      buttonClassName="btn btn-warning btn-sm"
                      label="Edit Your Skills"
                      onClick={goToSeekerProfile}
                    />
                  ) : null}
                </div>

                <div
                  className={`${
                    isProfileBuild ? "w-auto float-end" : "d-none"
                    }`}
                >
                  <CButton
                    buttonClassName="btn btn-warning btn-sm"
                    label="Edit Profile"
                    onClick={goToEditProfile}
                  />
                </div>

                <div className="w-auto float-end">
                  {isSeeker == false ? (
                    <CBecomeServiceProvider
                      showModal={showSeekerModal}
                      setShowModal={setShowSeekerModal}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <Row className="mt-2 mb-4 modalImportantInfo pt-4">
              <Col sm={12} md={12}>
                <Row>
                  <Col lg={3} md={6}>
                    <div className="w-auto float-start pe-2">
                      <CUserPhoto
                        profile={profile!}
                        returnNewProfile={(e) => setProfile(e)}
                      />
                    </div>
                    <div className="w-auto mt-2">
                      <CH4Label label={profile?.firstName ?? "-"} />
                      <CDisplay
                        heading="Display Name"
                        hideIcon={true}
                        label={profile?.displayName ?? "-"}
                      />
                    </div>
                  </Col>
                  <Col sm={12} md={6} lg={9} className="mt-2">
                    <CDisplay
                      heading="Email"
                      icon="/assets/icons/form_icons/icon_email.svg"
                      label={profile?.email ?? "-"}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={12}>
                <Row>
                  <Col lg={3}></Col>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Phone"
                      icon="/assets/icons/form_icons/icon_phone.svg"
                      label={profile?.phone ?? "-"}
                    />
                  </Col>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Whatsapp"
                      icon="/assets/icons/form_icons/icon_whatsapp.svg"
                      label={profile?.mobile ?? "-"}
                    />
                  </Col>
                  <Col sm={12} lg={3} md={4}>
                    <CDisplay
                      heading="Show mobile on profile"
                      icon="/assets/icons/form_icons/icon_user_profile.svg"
                      label={profile?.showPhone == true ? "Yes" : "No"}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Languages Spoken"
                  icon="/assets/icons/form_icons/icon_languages_spoken.svg"
                  label={returnLanguages()}
                />
              </Col>
              <Col sm={12} md={8}>
                <CDisplay
                  heading="Address"
                  icon="/assets/icons/form_icons/icon_address.svg"
                  label={returnAddress()}
                />
              </Col>
            </Row>

            {isSeeker && (
              <Row>
                <Col sm={12} md={4}>
                  <CDisplay
                    heading="Commute Preference"
                    icon="/assets/icons/form_icons/icon_commute.svg"
                    label={`${profile?.commutePreference ?? "-"}`}
                  />
                </Col>
                <Col md={8}>
                  <Row>
                    <Col sm={12} md={6}>
                      <CDisplay
                        heading="Dietary Preference"
                        icon="/assets/icons/form_icons/icon_diet.svg"
                        label={`${profile?.dietaryRestrictions ?? "-"}`}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <CDisplay
                        heading="OK With Pets"
                        icon="/assets/icons/form_icons/icon_pets.svg"
                        label={`${
                          profile?.okWithPets == true
                            ? "Yes"
                            : profile?.okWithPets == false
                              ? "No"
                              : "Not mentioned"
                          }`}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}

            <Row>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Facebook"
                  icon="/assets/icons/form_icons/icon_facebook.svg"
                  label={
                    typeof profile?.facebookLink === "undefined" ||
                      profile?.facebookLink?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                        href={`${profile?.facebookLink!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                        Click to open link
                      </Link>
                    )
                  }
                />
              </Col>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Instagram"
                  icon="/assets/icons/form_icons/icon_instagram.svg"
                  label={
                    typeof profile?.instagram === "undefined" ||
                      profile?.instagram?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                        href={`${profile?.instagram!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                         Click to open link
                      </Link>
                    )
                  }
                />
              </Col>
              <Col sm={12} md={4}>
                <CDisplay
                  heading="Website"
                  icon="/assets/icons/form_icons/icon_website.svg"
                  label={
                    typeof profile?.websiteLink === "undefined" ||
                      profile?.websiteLink?.length == 0 ? (
                      "Not provided"
                    ) : (
                      <Link
                        href={`${profile?.websiteLink!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                         Click to open link
                      </Link>
                    )
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <CDisplay
                  heading="About Me"
                  icon="/assets/icons/form_icons/icon_dummy_user.svg"
                  label={returnAboutMe()}
                />
              </Col>
            </Row>

            {/* Show details on experience and other parameters */}
            {isSeeker && <CExperienceDetails profile={profile} />}

            {isSeeker && (
              <CUserWorkPhotos workPhotos={profile?.uploadPhotoOfWork ?? []} />
            )}
          </div>
          {/* Change Password Modal */}
          <ChangePasswordModal
            open={changePasswordModalOpen}
            handleClose={handleChangePasswordClose}
          />
        </div>
      </div>
    );
  }
};

export default withAuth(UserProfile);
