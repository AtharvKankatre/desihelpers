// components/ProfileCard.tsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CUserPhoto } from "./CUserPhoto";
import { Col, Row } from "react-bootstrap";
import { CDisplay } from "@/components/reusable/CDisplay";
import { useAuth } from "@/services/authorization/AuthContext";
import { CExpDetails } from "./CExpDetails";
import { CUserWorkPhotos } from "./CUserWorkPhotos";
import Link from "next/link";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import router from "next/router";


type UserProfileProps = {
    profile: IUserProfileModel | null
};

const ProfileCard: React.FC<UserProfileProps> = ({ ...UserProfileProps }) => {
    const { isSeeker } = useAuth();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check the `isActive` status from cookies
    const activeStatus = Cookies.get("isActive") === "true";
    setIsActive(activeStatus);

    if (!activeStatus) {
      Swal.fire({
        title: "Access Denied",
        text: "Please log in to view the details.",
        icon: "warning",
        confirmButtonText: "OK",
    }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
    }
    if (!isSeeker) {
        Swal.fire({
          title: "Access Denied",
          text: "Please become a service provider to view the details.",
          icon: "warning",
          confirmButtonText: "OK",
      }).then((result) => {
          if (result.isConfirmed) {
            router.push("/Landing");
          }
        });
      }
  }, []);

  if (!isActive) {
    return null; 
  }
  if (!isSeeker) {
    return null; 
  }

    function returnLanguages() {
        return UserProfileProps.profile?.languagesSpoken == null
            ? ""
            : `${UserProfileProps.profile?.languagesSpoken.toString().split(",").join(", ")}`;
    }
    function returnAddress() {
        return `${UserProfileProps.profile?.addressLine1 ?? "-"} ${UserProfileProps.profile?.addressLine2 ?? ""}, ${UserProfileProps.profile?.city ?? "-"
            }, ${UserProfileProps.profile?.state ?? "-"} - ${UserProfileProps.profile?.zipCode ?? "-"}`;
    }
    function returnAboutMe() {
        return (
            <div>{UserProfileProps.profile?.aboutMe == null ? "-" : UserProfileProps.profile?.aboutMe.toString()}</div>
        );
    }

    const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
    const handleWhatsAppClick = () => {
        const whatsappURL = `${whatappApiUrl}send?phone=${UserProfileProps.profile?.mobile?.replace(/[^\d]/g, "")}`;
        window.open(whatsappURL, "_blank");
    };
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-center">
                    {/* Profile Image */}
                    <div className="me-md-4 mb-3 mb-md-0">
                        <CUserPhoto profile={UserProfileProps.profile} hideEditIcon ={true} />
                    </div>

                    {/* Profile Information */}
                    <div className="flex-grow-1">
                        <h5 className="card-title textSecondary mb-1">{UserProfileProps.profile?.displayName}</h5>
                        <p className="text-muted mb-2"></p>

                        <div className="d-flex flex-wrap">
                            {/* Location */}
                            <div className="me-4 mb-2">
                                <span className="text-secondary">
                                    <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{UserProfileProps.profile?.city},{UserProfileProps.profile?.state}
                                </span>
                            </div>

                        </div>
                        <hr />
                        <div className="row text-muted">
                            <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Phone"
                                    icon="/assets/icons/form_icons/icon_phone.svg"
                                    label={UserProfileProps.profile?.phone ?? "-"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                 {UserProfileProps.profile?.showMobile && (
                                    <div
                                        className="d-flex flex-row align-items-center"
                                        onClick={handleWhatsAppClick}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <CDisplay
                                            heading="Whatsapp"
                                            icon="/assets/icons/form_icons/icon_whatsapp.svg"
                                            label={UserProfileProps.profile?.mobile ?? "-"}
                                        />
                                    </div>
                                )}
                            </Col>

                            <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Show mobile on profile"
                                    icon="/assets/icons/form_icons/icon_user_profile.svg"
                                    label={UserProfileProps.profile?.showPhone == true ? "Yes" : "No"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                            <CDisplay
                                    heading="Email"
                                    icon="/assets/icons/form_icons/icon_email.svg"
                                    label={
                                        UserProfileProps.profile?.email ? (
                                            <Link
                                                href={`mailto:${UserProfileProps.profile?.email}`}
                                                style={{ cursor: "pointer" }} // Add pointer cursor
                                            >
                                                {UserProfileProps.profile?.email}
                                            </Link>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                                </Col> 
                            {/* </div> */}

                            {/* Address */}
                            <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Address"
                                    icon="/assets/icons/form_icons/icon_address.svg"
                                    label={returnAddress()}
                                />
                            </Col>

                                <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Languages Spoken"
                                    icon="/assets/icons/form_icons/icon_languages_spoken.svg"
                                    label={returnLanguages()}
                                />
                            </Col>
                        </div>
                    </div>
                </div>
                <div className="row text-muted">
                </div>
            </div>
            <div className="container mt-2">
                <div className="row">
                    {/* Left Section Card (40% width) */}
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0">
                            <div className="card-header">
                                <h5 className="card-title">Services Provided</h5>
                            </div>
                            <div className="card-body">
                                <div className="row text-muted">
                                    {isSeeker && <CExpDetails profile={UserProfileProps.profile} />}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right Section Cards (60% width, stacked vertically) */}
                    <div className="col-md-7">
                        <div className="card mb-3 shadow-sm border-0">
                            <div className="card-header">
                                <h5 className="card-title ">Personal details</h5>
                            </div>
                            <div className="card-body">

                                <div className="row text-muted">
                                    <div className="col-12 mb-2">
                                        {isSeeker && (
                                            <Row>
                                                <Col sm={12} md={4}>
                                                    <CDisplay
                                                        heading="Commute Preference"
                                                        icon="/assets/icons/form_icons/icon_commute.svg"
                                                        label={`${UserProfileProps.profile?.commutePreference ?? "-"}`}
                                                    />
                                                </Col>
                                                <Col md={8}>
                                                    <Row>
                                                        <Col sm={12} md={6}>
                                                            <CDisplay
                                                                heading="Dietary Preference"
                                                                icon="/assets/icons/form_icons/icon_diet.svg"
                                                                label={`${UserProfileProps.profile?.dietaryRestrictions ?? "-"}`}
                                                            />
                                                        </Col>
                                                        <Col sm={12} md={6}>
                                                            <CDisplay
                                                                heading="OK With Pets"
                                                                icon="/assets/icons/form_icons/icon_pets.svg"
                                                                label={`${UserProfileProps.profile?.okWithPets === true
                                                                    ? "Yes"
                                                                    : UserProfileProps.profile?.okWithPets === false
                                                                        ? "No"
                                                                        : "Not mentioned"
                                                                    }`}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card shadow-sm border-0 mb-3">
                            <div className="card-header">
                                <h5 className="card-title">About Me</h5>
                            </div>
                            <div className="card-body">
                                <Col sm={12} md={12}>
                                    <CDisplay
                                        heading="About Me"
                                        icon="/assets/icons/form_icons/icon_dummy_user.svg"
                                        label={returnAboutMe()}
                                    />
                                </Col>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="card shadow-sm border-0 ">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row align-items-center">

                        {/* Profile Information */}
                        <div className="flex-grow-1">
                            {isSeeker && (
                                <CUserWorkPhotos workPhotos={UserProfileProps.profile?.uploadPhotoOfWork ?? []} />
                            )}
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
};

export default ProfileCard;
