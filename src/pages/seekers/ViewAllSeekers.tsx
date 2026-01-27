import withAuth from "@/services/authorization/ProfileService";
import { FunctionComponent, useState } from "react";
import SeekerServices from "@/services/seekers/SeekerService";
import styles from "@/styles/Common.module.css";
import DataTable from "react-data-table-component";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { useRouter } from "next/router";
import { CDisplaySeekerDetailsModal } from "@/components/seekers/CDisplaySeekerDetailsModal";
import { ISeekerFilters } from "@/models/SeekerFilters";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import CCopyLinkButton from "@/components/reusable/CShareLink";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAllSeekers: FunctionComponent = () => {
  const router = useRouter();
  const jobServices = new SeekerServices();
  const [jobs, setJobs] = useState<IUserProfileModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IUserProfileModel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search query
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg"; // Replace with your dummy image path
  let filters: ISeekerFilters = {};
  const [selectedFilters, setSelectedFilters] = useState<any>({
    serviceType: "",
    city: "",
    state:"",
  });

  const fetchAllJobs = async () => {
    if (isInitialRender) {
      const fetchedJobs = await jobServices.fetchJobs(filters);
      setJobs(fetchedJobs);
      setIsInitialRender(false);
    }
    setIsLoading(false);
  };

  // Function to reset filters
  const resetFilters = () => {
    setSelectedFilters({ serviceType: "", city: "", state: "" });
    setSearchQuery(""); // Clear search query
  };

  if (isInitialRender) {
    fetchAllJobs();
  }

  const handleClose = () => setShowModal(false);

  const viewJobDetailsFn = (job: IUserProfileModel) => {
    setSelectedJob(job);
    setShowModal(true);
  };

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

  // Extract unique service types from jobs
  const getUniqueServiceTypes = () => {
    const serviceTypes = filteredJobs.flatMap(
      (job) => job.jobDetails?.map((detail) => detail.subCategory) || []
    );
    return Array.from(new Set(serviceTypes.filter(Boolean)));
  };

  // Function to filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearchQuery =
      job.displayName?.toLowerCase().includes(query) ||
      job.commutePreference?.toLowerCase().includes(query) ||
      job.city?.toLowerCase().includes(query) ||
      job.state?.toLowerCase().includes(query) ||
      job.jobDetails?.some((detail) =>
        detail.subCategory?.toLowerCase().includes(query)
      );

    const matchesServiceType =
      !selectedFilters.serviceType ||
      job.jobDetails?.some((detail) =>
        detail.subCategory
          ?.toLowerCase()
          .includes(selectedFilters.serviceType.toLowerCase())
      );

    const matchesCity =
      !selectedFilters.city ||
      job.city?.toLowerCase() === selectedFilters.city.toLowerCase();

    const matchesState =
      !selectedFilters.state ||
      job.state?.toLowerCase() === selectedFilters.state.toLowerCase();

    return (
      matchesSearchQuery && matchesServiceType && matchesCity && matchesState
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

  // DataTable columns definition
  const columns = [
    {
      name: "Details",
      cell: (row: IUserProfileModel) => (
        <CDisplaySeekerDetailsModal profile={row} source="all" />
      ),
      center: true,
      sortable: false,
    },
    {
      name: "Provider",
      cell: (row: IUserProfileModel) => (
        <div
        style={{
          display: "flex", // Use flexbox layout
          alignItems: "center", // Align items vertically
          gap: "5px", // Add spacing between elements
          marginTop: "5px"
        }}
      >
        <img
          src={
            row.profilePhoto
              ? getWorkPhotoUrls(process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "", [row.profilePhoto])[0]
              : dummyImage
          }
          alt="Profile Photo"
          className="rounded-circle"
          style={{ width: "30px", height: "30px" }}
        />
        <span>{row.displayName ?? "-"}</span>
        <CCopyLinkButton id={row._id || ""} />
        <ToastContainer />
      </div>
      ),
      sortable: true,
    },
    {
      name: "Service Type",
      cell: (row: IUserProfileModel) => (
        <div>
          {(row.jobDetails ?? [])
            .flatMap((detail) =>
              detail.icons
                ? [
                    {
                      src: detail.icons,
                      alt: `icon-${detail.jobTypeId}`,
                      subCategory: detail.subCategory,
                    },
                  ]
                : []
            )
            .map((icon, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  style={{ width: "24px", height: "24px", marginRight: "10px" }}
                />
                <span>{icon.subCategory}</span>
              </div>
            ))}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Commute Preference",
      selector: (row: IUserProfileModel) => (row.commutePreference && row.commutePreference !== "")? row.commutePreference : "-",
      center: true,
      sortable: true,
    },
    {
      name: "City/State",
      cell: (row: IUserProfileModel) => `${row.city && row.city !== "" ? `${row.city}, ${row.state ?? "-"}` : row.state ?? "-"}`,
      sortable: true,
    },
  ];

  return (
    <div className={`container-fluid ${styles.displayDetailsWrapper}`}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className={`container p-4 mb-2 ${styles.viewProfileMain}`}>
            <div className="row align-items-center mb-2">
              <div className="col-md-3 text-start">
                <img src="/assets/icons/icon_back_arrow.svg" alt="Back" onClick={router.back} className={`${styles.backArrow}`} />  
                <CH3Label label="Service Providers" />
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} // Update search query                  
                    />
                </div> 
              </div>

              <div className={`col-md-6 ms-1 mb-1 col-sm-12 ${styles.listFilters}`}>            
                  {/* Service Type Filter */}
                  <div className="mb-3">
                    <label>
                      <strong>Service Type</strong>
                    </label>
                    <select
                      className={`form-control ${styles.filterDiv}`}
                      value={selectedFilters.serviceType}
                      onChange={(e) =>
                        handleFilterChange("serviceType", e.target.value)
                      }
                    >
                      <option value="">Select Service Type</option>
                      {getUniqueServiceTypes().map((serviceType, index) => (
                        <option key={index} value={serviceType}>
                          {serviceType}
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
              </div>



              {/* Applied Filters */}
              {(Object.values(selectedFilters).some((filter) => filter) ||
                searchQuery) && (
                <div className={`mt-2 mb-2 ${styles.appliedFiltersDisplay}`}>
                  <div className={`mt-1 ms-1`}><strong>Applied Filters: </strong> </div>
                  <div className={`${styles.appliedFilters}`}>
                    {selectedFilters.serviceType && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                        Service Type: {selectedFilters.serviceType}
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
                    {searchQuery && (
                      <span className={`badge bg-secondary ${styles.filterBadge}`}>
                      Search By Name: {searchQuery}
                    </span>
                    )}

                    {/* Reset Filters Button */}
                    {(Object.values(selectedFilters).some((filter) => filter) ||
                      searchQuery) && (
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
            </div>
          


            <DataTable
              columns={columns}
              data={filteredJobs} // Pass filtered jobs here
              highlightOnHover
              striped
              persistTableHead
              responsive
              noHeader
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
    </div>
  );
};

export default withAuth(ViewAllSeekers);
