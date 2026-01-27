import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { CH6Label } from "@/components/reusable/labels/CH6Label";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { FunctionComponent } from "react";

type Props = {
  profile: IUserProfileModel | null;
};

export const CAboutMe: FunctionComponent<Props> = ({ profile }) => {
  return (
    <CExpandablePanel title="About me" id="aboutMe" isExpanded="show">
      <CH6Label label={profile?.aboutMe ?? "-"} />
      <br />

      <div className="row">
        <div className="col-md-4">
          <CH5Label label="Commute Preference : " />
          <span>
            <CH6Label label={profile?.commutePreference ?? "-"} />
          </span>
        </div>

        <div className="col-md-4">
          <CH5Label label="Dietary Restriction : " />
          <span>
            <CH6Label label={profile?.dietaryRestrictions ?? "-"} />
          </span>
        </div>

        <div className="col-md-4">
          <CH5Label label="OK with pets : " />
          <span>
            <CH6Label label={profile?.okWithPets == true ? "Yes" : "No"} />
          </span>
        </div>
      </div>
    </CExpandablePanel>
  );
};
