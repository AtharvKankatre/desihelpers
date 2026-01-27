import withAuth from "@/services/authorization/ProfileService";
import { FunctionComponent, useState, useEffect } from "react";
import styles from "@/styles/Common.module.css";
import DataTable from "react-data-table-component";
import CButton from "@/components/reusable/CButton";
import JobServices from "@/services/jobs/JobService";
import { IJobFilters } from "@/models/JobFilters";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { useRouter } from "next/router";
import { useAuth } from "@/services/authorization/AuthContext";
import ViewJobDetailsModal from "@/components/jobs/ViewJobDetailsModal";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import { IJobs } from "@/models/Jobs";
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import CShareLinkJobs from "@/components/reusable/labels/CShareLinkJobs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAllJobs: FunctionComponent = () => {
  const router = useRouter();
  const { jobCategories } = useAuth();
  const jobServices = new JobServices();
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
  const [filterText, setFilterText] = useState<string>(""); // State for search
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg"; // Dummy image path

  let filters: IJobFilters = {};
  const [selectedFilters, setSelectedFilters] = useState<any>({
    jobType: "",
    city: "",
    state:"",
    workType:""
  });

  const fetchAllJobs = () => {
    jobServices.fetchJobs(filters).then((data) => {
      setJobs(data);
      setIsInitialRender(false);
      setIsLoading(false);
    });
  }

  // Fetch jobs
  useEffect(() => {
    if (isInitialRender) {
      fetchAllJobs();
    }
  }, [isInitialRender]);
  
  const resetFilters = () => {
    setSelectedFilters({ jobType: "", city: "", state: "" , workType:"" });
    setFilterText(""); // Clear search query
  };

  const viewJobDetailsFn = (job: IJobs) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  // Function to extract unique states
  const getUniqueStates = () => {
    const states = new Set (filteredJobs.map((job) => job.state).filter((state) => state));
    return Array.from(states).sort();
  };

  // Function to extract unique cities
  const getUniqueCities = () => {
    const citiesSet = new Set(
      filteredJobs.map((job) => job.city).filter((city) => city)
    );
    return Array.from(citiesSet).sort(); // Sort alphabetically for better UX
  };

  const getUniqueJobTypes = () => {
    const serviceTypes = filteredJobs.map((job) => job.subCategory);
    return Array.from(new Set(serviceTypes.filter(Boolean)));
  };

  const getUniqueWorkTypes = () => {
    const workTypesSet = new Set(
      filteredJobs.map((job) => job.workType).filter((workType) => workType)
    );
    return Array.from(workTypesSet).sort(); // Sort alphabetically for better UX
  };


  // Function to filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const query = filterText.toLowerCase();
    const matchesSearchQuery =
    job.userProfile?.displayName
          ?.toLowerCase()
          .includes(query.toLowerCase()) ||
        job.jobType?.name?.toLowerCase().includes(query.toLowerCase()) ||
        job.city?.toLowerCase().includes(query.toLowerCase()) ||
        job.state?.toLowerCase().includes(query.toLowerCase()) ||
        job.subCategory?.toLowerCase().includes(query.toLowerCase()) ||
        job.workType?.toLowerCase().includes(query.toLowerCase()) ||
        job.payRange?.toLowerCase().includes(query.toLowerCase())

    const matchesServiceType =
      !selectedFilters.jobType ||
      job.subCategory?.toLowerCase()
          .includes(selectedFilters.jobType.toLowerCase());

    const matchesCity =
      !selectedFilters.city ||
      job.city?.toLowerCase() === selectedFilters.city.toLowerCase();

    const matchesState =
      !selectedFilters.state ||
      job.state?.toLowerCase() === selectedFilters.state.toLowerCase();

      const matchesWorkType =
      !selectedFilters.workType ||
      job.workType?.toLowerCase()
          .includes(selectedFilters.workType.toLowerCase());

    return (
      matchesSearchQuery && matchesServiceType && matchesCity && matchesState && matchesWorkType
    );
  });  

    const handleFilterChange = (filterKey: string, value: string) => {
      setSelectedFilters((prevFilters: any) => {
        const updatedFilters = { ...prevFilters };
  
        if (value) {
          // Set the selected filter value
          updatedFilters[filterKey] = value;
        } else {
          // Remove the filter if no value is selected
          delete updatedFilters[filterKey];
        }
  
        return updatedFilters;
      });
    };

  if (isLoading) return <CCommonLoader />;

  // Define columns for DataTable
  const columns = [
    {
      name: "Details",
      cell: (row: IJobs) => (
        <CButton
          label="View"
          buttonClassName="btn btn-warning btn-sm"
          onClick={() => viewJobDetailsFn(row)}
        />
      ),
      sortable: true,
    },
    {
      name: "Posted By",
      cell: (row: IJobs) => {
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
        const photosArray = row.userProfile?.profilePhoto
          ? [row.userProfile.profilePhoto]
          : [];
        const urls = getWorkPhotoUrls(bucketName || "", photosArray);
        const profilePhotoUrl = (urls.length > 0 && urls[0] !== "") ? urls[0] : dummyImage;

        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "5px",
              }}
             
            >
              <img
                src={profilePhotoUrl}
                alt="Profile Photo"
                className="rounded-circle"
                style={{ width: "30px", height: "30px" }}
              />
              <span>{row.userProfile?.displayName ?? "-"}</span>
              <CShareLinkJobs id={row.id || ""} />
              <ToastContainer />
            </div>
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row: IJobs) => {
        const icon = row.jobType?.icons
          ? `<img src="${row.jobType.icons}" alt="icon" width="20" height="20" />`
          : "-";
        const subCategory = row.subCategory ?? "-";
        return (
          <span>
            <span dangerouslySetInnerHTML={{ __html: icon }} /><br/> {subCategory}
          </span>
        );
      },
      sortable: true,
    },

    {
      name: "Work Type",
      selector: (row: IJobs) => (row.workType && row.workType !== "") ? row.workType :"-",
      sortable: true,
    },
    {
      name: "Urgent",
      cell: (row: IJobs) =>
        row.urgent ? (
          <img
            src="/assets/icons/form_icons/icon_urgent_need.svg"
            alt="Urgent Icon"
            style={{ width: "20px", height: "20px" }}
          />
        ) : (
          "-"
        ),
      sortable: true,
    },
    {
      name: "City/State",
      cell: (row: IJobs) => `${row.city && row.city !== "" ? `${row.city}, ${row.state ?? "-"}` : row.state ?? "-"}`,      
      sortable: true,
      
    },
  ];

  return (
    <div className={`container-fluid ${styles.displayDetailsWrapper}`}>
      <div className="row just-content-center">
        <div className="col-md-12">
          <div className={`container p-4 mb-4 ${styles.viewProfileMain}`}>
            <div className="row align-items-center mb-2">

              <div className="col-md-2 text-start">
                <img src="/assets/icons/icon_back_arrow.svg" alt="Back" onClick={router.back} className={`${styles.backArrow}`} />                
                <CH3Label label="Job Posts" />
              </div>

              {/* Search input */}
              <div className="col-md-2 mb-1 ms-1 col-sm-12">
               <div className="mb-3">
                    <label className={`${styles.listFilters}`}>
                      <strong>Search</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.filterDiv}`}
                      placeholder="Search By Name"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)} // Update search query                  
                    />
                </div>
              </div>

              <div className={`col-md-6 ms-1 mt-1 mb-1 col-sm-12 ${styles.listFilters}`}>
                {/* Service Type Filter */}
                <div className="mb-3">
                  <label>
                    <strong>Job Type</strong>
                  </label>
                  <select
                    className={`form-control ${styles.filterDiv}`}
                    value={selectedFilters.jobType}
                    onChange={(e) =>
                      handleFilterChange("jobType", e.target.value)
                    }
                  >
                    <option value="">Select Job Type</option>
                    {getUniqueJobTypes().map((jobType, index) => (
                      <option key={index} value={jobType}>
                        {jobType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Filter */}
                <div className="mb-3">
                  <label>
                    <strong>State</strong>
                  </label>
                  <select
                    className={`form-control ${styles.filterDiv}`}
                    value={selectedFilters.state}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                  >
                    <option value="">Select State</option>
                    {getUniqueStates().map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="mb-3">
                  <label>
                    <strong>City</strong>
                  </label>
                  <select
                    className={`form-control ${styles.filterDiv}`}
                    value={selectedFilters.city}
                    onChange={(e) =>
                      handleFilterChange("city", e.target.value)
                    }
                  >
                    <option value="">Select City</option>
                    {getUniqueCities().map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Work Type Filter */}
                <div className="mb-3">
                  <label>
                    <strong>Work Type</strong>
                  </label>
                  <select
                    className={`form-control ${styles.filterDiv}`}
                    value={selectedFilters.workType}
                    onChange={(e) =>
                      handleFilterChange("workType", e.target.value)
                    }
                  >
                    <option value="">Select Work Type</option>
                    {getUniqueWorkTypes().map((workType, index) => (
                      <option key={index} value={workType}>
                        {workType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>              
            </div>

              {/* Applied Filters */}
              {(Object.values(selectedFilters).some((filter) => filter) ||
                filterText) && (
                <div className={`mt-3 mb-3 ${styles.appliedFiltersDisplay}`}>
                  <div className={`mt-1 ms-1`}><strong>Applied Filters: </strong> </div>
                  <div className={`${styles.appliedFilters}`}>
                    {selectedFilters.jobType && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        Job Type: {selectedFilters.jobType}
                      </span>
                    )}
                    {selectedFilters.city && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        City: {selectedFilters.city}
                      </span>
                    )}
                    {selectedFilters.state && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        State: {selectedFilters.state}
                      </span>
                    )}
                    {selectedFilters.workType && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        Work Type: {selectedFilters.workType}
                      </span>
                    )}                    
                    {filterText && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        Search By Name: {filterText}
                      </span>
                    )}

                    {/* Reset Filters Button */}
                    {(Object.values(selectedFilters).some((filter) => filter) ||
                      filterText) && (
                      <button
                        className="btn btn-sm btn-outline-danger ms-1"
                        style={{ width: "fit-content", height:'33px', marginTop: "3px" }}
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}

            <DataTable
              columns={columns}
              data={filteredJobs}
              highlightOnHover
              responsive
              noHeader
              //className={styles.customDataTable}
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#e2e2e2",
                    fontWeight: "bold",
                    color: "black",
                    boxShadow: "0 2px 6px 2px #eee",
                    borderRadius: "5px",
                    fontSize: "14px",
                  },
                },
                rows: {
                  style: {                    
                    fontSize: "16px", // Increase font size for row data
                    padding: "10px", // Adjust padding if needed
                  },
                },
              }}
             // paginationPerPage={50} // Set default rows per page
              // paginationComponentOptions={{
              //   rowsPerPageText: 'Rows per page:',
              // }}
              // striped
              // paginationRowsPerPageOptions={[5, 10, 20,30]} // Options for rows per page
            />
            <hr />

            <div className="col-md-12 text-end mb-3">
              <button
                onClick={router.back}
                className="btn btn-secondary bgCancel"
                type="submit"
              >
                Back
              </button>
            </div> 
          </div>
        </div>
      </div>
      {/* Job Details Modal */}
      {selectedJob && (
        <ViewJobDetailsModal
          showModal={showModal}
          handleClose={handleCloseModal}
          job={selectedJob}
        />
      )}


    </div>
    
  );
};

export default withAuth(ViewAllJobs);
