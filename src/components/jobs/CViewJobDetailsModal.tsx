import { IJobs } from "@/models/Jobs";
import { FunctionComponent } from "react";
import { CTitlePlusLabel } from "../reusable/labels/CTitlePlusLabel";
import { CH3Label } from "../reusable/labels/CH3Label";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  job: IJobs;
  closeJobFn?: () => void;
};

export const CViewJobDetailsModal: FunctionComponent<Props> = ({
  job,
  closeJobFn,
}) => {
  function onCloseFn() {
    if (closeJobFn != null) closeJobFn();
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-sm w-100 mb-2"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        View
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Job Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Photo */}
                <div className="col-md-3">Photo</div>

                {/* Basic details like name, email and contact numberr */}
                <div className="col-md-9">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0">
                      <CH3Label label={job?.userProfile?.displayName ?? "NA"} />
                    </li>
                    <li className="list-group-item border-0">
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
                  <CH3Label
                    label={`Job Profile : ${job?.jobType?.name ?? "-"}`}
                  />
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
                    <strong>Address:</strong>
                    <br />
                    {job?.addressLine1 ?? "NA"}
                    <br />
                    {job?.addressLine1 ?? "NA"}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
