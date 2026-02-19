import withAuth from "@/services/authorization/ProfileService";
import styles from "@/styles/Common.module.css";
import { useEffect, useState } from "react";
import JobServices from "@/services/jobs/JobService";
import { IJobs } from "@/models/Jobs";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { CMyJobDisplayCard } from "@/components/jobs/CMyJobDisplayCard";
import { CH6Label } from "@/components/reusable/labels/CH6Label";
import { CEditAJob } from "@/components/jobs/CEditAJob";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import router from "next/router";
import ApiService from "@/services/data/crud/crud";

const MyPostedJobs = () => {
  const jobServices = new JobServices();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [isJobEdit, setIsJobEdit] = useState<boolean>(false);
  const [jobToEdit, setJobToEdit] = useState<IJobs>();

  useEffect(() => {
    if (router.query.email) {
      fetchDatabyemail();
    } else {
      fetchData();
    }
  }, [router.query.email]);

  const fetchData = async () => {
    let t: IJobs[] = await jobServices.fetchMyJobs();
    setJobs(t);
    setIsLoading(false);
  };
  
  const fetchDatabyemail = async () => {
    let list: IJobs[] = [];
    var result = await ApiService.crud(APIDetails.AdminMyJobPost, router.query.email);
    if (result[0]) {
      list = result[1];
    }
    setJobs(list);
    setIsLoading(false);
  };

  const deleteAJob = async (jobToDelete: IJobs) => {
    setIsLoading(true);

    var result = await jobServices.deleteAJob(jobToDelete.id ?? "-");

    if (result[0]) {
      await fetchData();
    }
  };

  const editAJob = (jobToEdit: IJobs) => {
    setJobToEdit(jobToEdit);
    setIsJobEdit(!isJobEdit);
  };

  const getDataAgain = () => {
    setIsJobEdit(false);
    setIsLoading(true);
    fetchData();
  };

  return (
    <div className={`container-fluid ${styles.displayDetailsWrapper}`}>
      <div className="row col-md-12 mx-auto">
        <CH2Label className="col-md-12" label="My Posted Jobs" />
        <hr className="mb-4" />

        {isLoading ? (
          <CCommonLoader />
        ) : jobs.length == 0 ? (
          <CH6Label label="You have yet to post any job openings" />
        ) : isJobEdit ? (
          <CEditAJob
            closeEditing={() => getDataAgain()}
            job={jobToEdit!}
            normalCloseFn={() => setIsJobEdit(false)}
          />
        ) : (
          jobs.map((job) => (
            <CMyJobDisplayCard
              key={job.id ?? "-"}
              job={job}
              className="col-md-4"
              deleteAJob={deleteAJob}
              editAJob={editAJob}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default withAuth(MyPostedJobs);
