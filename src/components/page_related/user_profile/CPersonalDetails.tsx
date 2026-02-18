import { IUserProfileModel } from "@/models/UserProfileModel";
import { FunctionComponent } from "react";
import profileStyles from "@/styles/UserProfiles.module.css";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";

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
      <div className="row">
        <ul className="col-md-7">
          <li className={profileStyles.titleCSS}>City/State</li>
          {/* <li className={profileStyles.labelCSS}>
            {profile?.addressLine1 ?? "NA"}
          </li>
          <li className={profileStyles.labelCSS}>
            {profile?.addressLine2 ?? "NA"}
          </li> */}
          <li className={profileStyles.labelCSS}>
            <span>{`${profile?.city ?? ""} , `}</span>
            <span>{`${profile?.state ?? ""} `}</span>
            {/* <span>{profile?.zipCode ?? ""}</span> */}
          </li>
        </ul>

        <ul className="col-md-5">
          <li className={`d-flex flex-row ${profileStyles.titleCSS}`}>
            Languages Spoken
          </li>
          {profile?.languagesSpoken?.map((lang) => (
            <span key={lang}>
              <div className="badge me-2 rounded-pill fs-6 mt-2 text-bg-secondary">
                {lang}
              </div>
            </span>
          ))}
        </ul>

        <div className="col-md-7">
          <CTitlePlusLabel
            title="Facebook"
            label={profile?.facebookLink ?? "-"}
            isHref={true}
          />
        </div>
        <div className="col-md-5">
          <CTitlePlusLabel
            title="Instragram"
            label={profile?.instagram ?? "-"}
            isHref={true}
          />
        </div>

        <div className="col-md-6">
          <CTitlePlusLabel
            title="Website"
            label={profile?.websiteLink ?? "-"}
            isHref={true}
          />
        </div>
      </div>
    </CExpandablePanel>
  );
};
