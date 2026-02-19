import { IJobs } from "@/models/Jobs";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import styles from "@/styles/Common.module.css";
import jobStyles from "@/styles/Jobs.module.css";
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";

const ViewJobDetails: FunctionComponent = () => {
  const router = useRouter();
  const { jobQuery } = router.query;
  const [job, setJob] = useState<IJobs | undefined>(undefined);

  useEffect(() => {
    let data: IJobs = JSON.parse(jobQuery as string);
    setJob(data);
  }, []);

  //   const formattedDate = new Intl.DateTimeFormat("en-US", {
  //     dateStyle: "medium",
  //   }).format(new Date(job?.startDate!));

  return (
    <div className={`container-fluid ${styles.displayDetailsWrapper}`}>
      <div className="col-md-12">
        <div className={`container p-4 ${jobStyles.viewJobDetailsMainBody}`}>
          <div className="row">
            {/* Photo */}
            <div className="col-md-3">Photo</div>

            {/* Basic details like name, email and contact numberr */}
            <div className="col-md-9">
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0">
                  <CH3Label label={job?.userProfile?.displayName ?? "NA"} />
                </li>
                <li className={`list-group-item border-0 ${styles.emailWrap}`}>
                  <CTitlePlusLabel
                    title="Email"
                    label={job?.userProfile?.email ?? "NA"}
                  />
                </li>
              </ul>
            </div>

            <hr className="mt-4" />

            {/* Job profile and start date - Has to be highlighted */}
            <div className="col-md-10">
              <CH3Label label={`Job Profile : ${job?.jobType?.name ?? "-"}`} />
            </div>
            <div className="col-md-2">
              <img
                src={job?.jobType?.icons}
                alt={job?.jobType?.name}
                height={34}
              />
            </div>
            <div className="col-md-12">
              <CTitlePlusLabel title="Start Date" label={"formattedDate"} />
            </div>

            <hr className="mt-4" />

            {/* Address */}
            <div className="col-md-4">
              <address>
                <strong>City/State:</strong>
                <br />
                {job?.city ?? "NA"}
                <br />
                {job?.state ?? "NA"}
              </address>
            </div>

            {/* Job description */}
            <div className="col-md-8">
              <address>
                <strong>Job Description:</strong>
                <br />
                {job?.aboutRequirement ?? "NA"}
              </address>
            </div>

            {/* Remaining details */}
            <div className="col-md-4">
              <strong>Sub Category : </strong>
              <span>{job?.subCategory ?? "-"}</span>
            </div>

            <div className="col-md-4">
              <strong>Required Experience : </strong>
              <span>{job?.requiredExperience ?? "-"}</span>
            </div>

            <div className="col-md-4">
              <strong>Work Type : </strong>
              <span>{job?.workType ?? "-"}</span>
            </div>

            <div className="col-md-4">
              <strong>Number of days : </strong>
              <span>{job?.numberOfDays ?? "-"}</span>
            </div>

            <div className="col-md-4">
              <strong>Pay Range : </strong>
              <span>{job?.payRange ?? "-"}</span>
            </div>

            <div className="col-md-4">
              <strong>Urgent : </strong>
              <span>{job?.urgent ?? "No"}</span>
            </div>

            <div className="col-md-4">
              <strong>Diet Preference : </strong>
              <span>{job?.dietaryPreference ?? "-"}</span>
            </div>

            <hr className="mt-4" />
            <div className="col-md-4 mb-3">
              <button
                className="btn btn-secondary btn-small"
                onClick={() => router.back()}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobDetails;
