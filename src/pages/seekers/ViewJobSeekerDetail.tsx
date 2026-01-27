import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import styles from "@/styles/Common.module.css";
import jobStyles from "@/styles/Jobs.module.css";
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import { CTitlePlusLabel } from "@/components/reusable/labels/CTitlePlusLabel";
import { IUserProfileModel } from "@/models/UserProfileModel";

const ViewJobSeekerDetails: FunctionComponent = () => {
  const router = useRouter();
  const { jobQuery } = router.query;
  const [jobSeeker, setJobSeeker] = useState<IUserProfileModel | undefined>(
    undefined
  );

  useEffect(() => {
    let data: IUserProfileModel = JSON.parse(jobQuery as string);
    setJobSeeker(data);
  }, []);

  return (
    <div className={`container-fluid ${styles.displayDetailsWrapper}`}>
      <div className="col-md-12">
        <div className={`container p-4 ${jobStyles.viewJobDetailsMainBody}`}>
          <div className="row">
            {/* Photo */}
            <ul className="list-group list-group-horizontal col-md-12">
              <li className="list-group-item w-auto">
                {" "}
                <img
                  src={
                    jobSeeker?.profilePhoto ||
                    "/assets/icons/form_icons/icon_dummy_user.svg"
                  }
                  alt="Profile Photo"
                  className="rounded-circle me-2"
                  style={{ width: "100px", height: "100px" }}
                />
              </li>
              <li className="list-group-item col">
                <div className="col-md-9">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0">
                      <CH3Label label={jobSeeker?.displayName ?? "NA"} />
                    </li>
                    <li className="list-group-item border-0">
                      <CTitlePlusLabel
                        title="Email"
                        label={jobSeeker?.email ?? "NA"}
                      />
                    </li>
                  </ul>
                </div>
              </li>
            </ul>

            <hr className="mt-4" />

            {/* Job profile and start date - Has to be highlighted */}
            <div className="col-md-10">
              {/* <CH3Label label={`Job Profile : ${job?.jobType?.name ?? "-"}`} /> */}
            </div>
            <div className="col-md-2">
              <img
                // src={job?.jobType?.icons}
                // alt={job?.jobType?.name}
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
                <strong>Address:</strong>
                <br />
                {jobSeeker?.addressLine1 ?? "NA"}
                <br />
                {jobSeeker?.addressLine2 ?? "NA"}
              </address>
            </div>

            {/* Job description */}
            <div className="col-md-8">
              <address>
                <strong>Job Description:</strong>
                <br />
                {/* {job?.aboutRequirement ?? "NA"} */}
              </address>
            </div>

            {/* Remaining details */}
            <div className="col-md-4">
              <strong>Sub Category : </strong>
              {/* <span>{job?.subCategory ?? "-"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Required Experience : </strong>
              {/* <span>{job?.requiredExperience ?? "-"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Work Type : </strong>
              {/* <span>{job?.workType ?? "-"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Number of days : </strong>
              {/* <span>{job?.numberOfDays ?? "-"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Pay Range : </strong>
              {/* <span>{job?.payRange ?? "-"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Urgent : </strong>
              {/* <span>{job?.urgent ?? "No"}</span> */}
            </div>

            <div className="col-md-4">
              <strong>Diet Preference : </strong>
              {/* <span>{job?.dietaryPreference ?? "-"}</span> */}
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

export default ViewJobSeekerDetails;
