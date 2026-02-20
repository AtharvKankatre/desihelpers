import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CTable } from "@/components/reusable/CTable";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { FunctionComponent } from "react";
import styles from "@/styles/UserProfiles.module.css"
import { getOptimizedIcon } from "@/utils/iconMapping";
import Image from "next/image";
type Props = {
  profile: IUserProfileModel | null;
};

export const CExperienceDetails: FunctionComponent<Props> = ({ profile }) => {
  return (
    <CExpandablePanel
      title="Experience and other details"
      id="experience"
      isExpanded="show"
    >
      {profile?.jobDetails?.length == 0 ? (
        <p className="text-secondary">
          You have not added any job experience yet. Please click on &quot;Add Your skills
          &quot; to add your experience.
        </p>
      ) : (
        <div>
          <CTable
            headDetails={[
              "Job Type",
              "Sub Category",
              "Description",
              "Experience",
              "Available",
            ]}
            bodyDetails={
              <>
                {profile?.jobDetails?.map((e) => (
                  <tr key={e.id ?? "-"}>
                    <td className="col-md-2 text-center" scope="row">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                          <Image
                            src={getOptimizedIcon(e.subCategory || e.jobType || "")}
                            alt={e.jobType || "icon"}
                            fill
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <span>{e.jobType ?? "-"}</span>
                      </div>
                    </td>
                    <th className="col-md-2 text-center">
                      {e.subCategory ?? "-"}
                    </th>
                    <td className="col-md-6 text-center">
                      <div className={styles.scrollableDescription}>
                        {e.description ?? "-"}
                      </div>
                    </td>
                    <td className="col-md-1 text-center">
                      {e.yearsOfExperience ?? "-"}
                    </td>
                    <td className="col-md-1 text-center">
                      {e.available == true ? "Yes" : "No"}
                    </td>
                    {/* <td className="col-md-2 text-center">
                    {e.postOnProfile == true ? "Yes" : "No"}
                  </td> */}
                  </tr>
                ))}
              </>
            }
          />
        </div>
      )}
    </CExpandablePanel>
  );
};
