import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { FunctionComponent } from "react";
import styles from "@/styles/UserProfiles.module.css";
import { IUserProfileModel } from "@/models/UserProfileModel";
import style from "@/styles/Common.module.css";

type Props = {
  profile: IUserProfileModel | null;
};

export const CExpDetails: FunctionComponent<Props> = ({ profile }) => {
  return (
    <>
      {profile?.jobDetails?.length === 0 ? (
        <p className="text-secondary">
          You have not added any job experience yet. Please click on &quot;Add Your Skills&quot; to add your experience.
        </p>
      ) : (
        <div>
          {profile?.jobDetails?.map((job, index) => (
            <CExpandablePanel
              key={job.id ?? `job-${index}`}
              title={`${job.jobType ? `• ${job.jobType} ` : '• Not mentioned Job Type'}`}
              id={`job-${index}`}
              isExpanded="hide"
              className="textSecondary"
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>Sub Category:</strong> {job.subCategory ?? "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Description:</strong>{" "}
                    <span className={styles.scrollableDescription}>
                      {job.description ?? "-"}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Experience:</strong> {job.yearsOfExperience ?? "-"} years
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Available:</strong> {job.available ? "Yes" : "No"}
                  </p>
                </div>
              </div>

            </CExpandablePanel>
          ))}
        </div>
      )}
    </>
  );
};
