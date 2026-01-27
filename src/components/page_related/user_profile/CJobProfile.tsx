// components/ProfileCard.tsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CUserPhoto } from "./CUserPhoto";
import { Col, Row } from "react-bootstrap";
import { CDisplay } from "@/components/reusable/CDisplay";
import { useAuth } from "@/services/authorization/AuthContext";
import style from "@/styles/UserProfiles.module.css"
import { formatDate } from "@/services/functions/FormatDate";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import Link from "next/link";
import router from "next/router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";


type UserProfileProps = {
    profile: IUserProfileModel | null
};

const ProfileCard: React.FC<UserProfileProps> = ({ ...UserProfileProps }) => {
    const { tablet } = useAppMediaQuery();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
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
    }, []);
  
    if (!isActive) {
      return null; 
    }
  
    function returnAddress() {
        return `${UserProfileProps.profile?.addressLine1 ?? "-"} ${UserProfileProps.profile?.addressLine2 ?? ""}, ${UserProfileProps.profile?.city ?? "-"
            }, ${UserProfileProps.profile?.state ?? "-"} - ${UserProfileProps.profile?.zipCode ?? "-"}`;
    }
    const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
    const handleWhatsAppClick = () => {
        const whatsappURL = `${whatappApiUrl}send?phone=${UserProfileProps.profile?.userProfile?.mobile?.replace(/[^\d]/g, "")}`;
        window.open(whatsappURL, "_blank");
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-center">
                    {/* Profile Image */}
                    <div className="me-md-4 mb-3 mb-md-0">
                        <CUserPhoto profile={UserProfileProps.profile?.userProfile!} hideEditIcon ={true} />
                    </div>

                    {/* Profile Information */}
                    <div className="flex-grow-1">
                        <h5 className="card-title textSecondary mb-1">{UserProfileProps.profile?.userProfile.displayName}</h5>
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
                                    label={UserProfileProps.profile?.userProfile?.phone ?? "-"}
                                />
                            </Col>
                            <Col sm={12} md={4}>

                                {UserProfileProps.profile?.userProfile?.showMobile && (
                                    <div
                                        className="d-flex flex-row align-items-center"
                                        onClick={handleWhatsAppClick}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <CDisplay
                                            heading="Whatsapp"
                                            icon="/assets/icons/form_icons/icon_whatsapp.svg"
                                            label={UserProfileProps.profile?.userProfile?.mobile ?? "-"}
                                        />
                                    </div>
                                )}
                            </Col>

                            <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Show mobile on profile"
                                    icon="/assets/icons/form_icons/icon_user_profile.svg"
                                    label={UserProfileProps.profile?.userProfile?.showPhone == true ? "Yes" : "No"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <CDisplay
                                    heading="Email"
                                    icon="/assets/icons/form_icons/icon_email.svg"
                                    label={
                                        UserProfileProps.profile?.userProfile?.email ? (
                                            <Link
                                                href={`mailto:${UserProfileProps.profile?.userProfile.email}`}
                                                style={{ cursor: "pointer" }} // Add pointer cursor
                                            >
                                                {UserProfileProps.profile?.userProfile.email}
                                            </Link>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                            </Col>
                            {/* </div> */}

                            {/* Address */}
                            <Col sm={12} md={8}>
                                <CDisplay
                                    heading="Address"
                                    icon="/assets/icons/form_icons/icon_address.svg"
                                    label={returnAddress()}
                                />
                            </Col>
                        </div>
                    </div>
                </div>
                <div className="row text-muted">
                </div>
            </div>
            <div className="container mt-2 mb-4">
                <div className="row">
                    {/* Left Section Card (100% width) */}
                    <div className="col-12"> {/* Updated from col-md-5 to col-12 */}
                        <div className="card shadow-sm border-0">
                            <div className="card-header">
                                <h5 className="card-title">Posted Job Details</h5>
                            </div>
                            <div className="card-body">
                                <div className="row text-muted">
                                    <Row>
                                        <Col sm={12} className="pt-2 modalImportantInfo">
                                            <CDisplay
                                                className="mb-0"
                                                heading="Job Description"
                                                icon="/assets/icons/form_icons/icon_job_description.svg"
                                                label={
                                                    <div className={style.scrollableDescription}>
                                                        {UserProfileProps.profile?.aboutRequirement ?? "Not mentioned"}
                                                    </div>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Location"
                                                icon="/assets/icons/form_icons/icon_address.svg"
                                                label={`${UserProfileProps.profile?.city}, ${UserProfileProps.profile?.state}`}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Start Date"
                                                icon="/assets/icons/form_icons/icon_calendar.svg"
                                                label={`${formatDate(UserProfileProps.profile?.startDate?.toString())}`}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Required Experience (in years)"
                                                icon="/assets/icons/form_icons/icon_experience.svg"
                                                label={`${UserProfileProps.profile?.requiredExperience ?? "Not mentioned"}`}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Work Type"
                                                icon="/assets/icons/form_icons/ico_work_type.svg"
                                                label={UserProfileProps.profile?.workType ?? "Not mentioned"}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Days per week"
                                                icon="/assets/icons/form_icons/icon_no_of_days.svg"
                                                label={`${UserProfileProps.profile?.numberOfDays ?? "Not mentioned"}`}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Pay Range"
                                                icon="/assets/icons/form_icons/icon_pay_range.svg"
                                                label={`${UserProfileProps.profile?.payRange ?? "Not mentioned"}`}
                                            />
                                        </Col>
                                        <Col md={tablet ? 12 : 4}>
                                            <CDisplay
                                                heading="Dietary Preference"
                                                icon="/assets/icons/form_icons/icon_diet.svg"
                                                label={UserProfileProps.profile?.dietaryPreference ?? "Not mentioned"}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfileCard;
