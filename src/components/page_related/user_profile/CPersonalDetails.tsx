import { IUserProfileModel } from "@/models/UserProfileModel";
import { FunctionComponent } from "react";
import profileStyles from "@/styles/UserProfiles.module.css";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";
import { CDisplay } from "@/components/reusable/CDisplay";

type Props = {
  profile: IUserProfileModel | null;
};

export const CPersonalDetails: FunctionComponent<Props> = ({ profile }) => {
  return (
    <CExpandablePanel
      title="Personal Details"
      isExpanded="show"
      id="personalDetails"
    >
      <div className="row g-4">
        {/* Main Details Section */}
        <div className="col-md-7">
          <div className="row g-3">
            <div className="col-12">
              <CDisplay
                heading="City / State"
                icon="/assets/icons/form_icons/icon_address.svg"
                label={`${profile?.city ?? "-"} , ${profile?.state ?? "-"}`}
              />
            </div>
            
            <div className="col-md-6">
              <CDisplay
                heading="Mobile Number"
                icon="/assets/icons/form_icons/icon_phone.svg"
                label={profile?.phone ?? "-"}
              />
            </div>

            <div className="col-md-6">
              <CDisplay
                heading="List Profile As"
                icon="/assets/icons/form_icons/icon_user_profile.svg"
                label={
                  <span style={{ 
                    backgroundColor: '#fff0e0', 
                    color: '#f07c00', 
                    padding: '4px 12px', 
                    borderRadius: '16px', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: '1px solid #ffe0c0'
                  }}>
                    {profile?.listProfileAs === "Job Seeker" ? "Hire Someone" : (profile?.listProfileAs ?? "Both")}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="col-md-5">
          <ul className="ps-0 mb-0" style={{ listStyle: 'none' }}>
            <li className={`d-flex flex-row ${profileStyles.titleCSS} mb-2`}>
              Languages Spoken
            </li>
            <div className="d-flex flex-wrap gap-2">
              {profile?.languagesSpoken?.map((lang) => (
                <span key={lang} className="badge rounded-pill px-3 py-2 fs-7 text-bg-light border">
                  {lang}
                </span>
              ))}
              {(!profile?.languagesSpoken || profile.languagesSpoken.length === 0) && (
                <span className="text-muted small">Not specified</span>
              )}
            </div>
          </ul>
        </div>

        {/* Social Links Section */}
        <div className="col-12 mt-2">
          <div className="row g-3">
            <div className="col-md-4">
              <CTitlePlusLabel
                title="Facebook"
                label={profile?.facebookLink ?? "-"}
                isHref={!!profile?.facebookLink && profile.facebookLink !== "-"}
              />
            </div>
            <div className="col-md-4">
              <CTitlePlusLabel
                title="Instagram"
                label={profile?.instagram ?? "-"}
                isHref={!!profile?.instagram && profile.instagram !== "-"}
              />
            </div>
            <div className="col-md-4">
              <CTitlePlusLabel
                title="Website"
                label={profile?.websiteLink ?? "-"}
                isHref={!!profile?.websiteLink && profile.websiteLink !== "-"}
              />
            </div>
          </div>
        </div>
      </div>
    </CExpandablePanel>
  );
};
