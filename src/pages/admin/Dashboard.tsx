import React, { useEffect, useState } from "react";
import {
  Dropdown,
} from "react-bootstrap";
import {
  FaBars,
  FaFileExport,
  FaPhoneAlt,
  FaPlus,
  FaUser,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useRouter } from "next/router";
import ApiService from "@/services/data/crud/crud";
import DataTable from "react-data-table-component";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import UserModal from "@/components/admin/ViewUserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faPlusSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Routes } from "@/services/routes/Routes";
import { IUserProfileModel } from "@/models/UserProfileModel";
import Swal from "sweetalert2";
import { useAuth } from "@/services/authorization/AuthContext";
import AdminSignUpModal from "@/components/admin/AdminSignUpModal";
import { toast } from "react-toastify";
import Roles from "@/constants/ERoles";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import UpdateJobSeekerStatus from "@/components/admin/UpdateJobSeekerStatus";
import styles from "@/styles/UserProfiles.module.css";
import AdminServices from "@/services/admin/adminService";
import { IUsers } from "@/models/UsersModel";
import { FaEllipsisVertical, FaSistrix } from "react-icons/fa6";
import style from "@/styles/Admin.module.css";
import { exportToExcel } from "@/utils/exportToExcel";
import { date } from "yup";

interface UserDetails {
  email: string;
  IsJobSeeker: boolean;
  IsProfile: boolean;
}

interface RowData {
  email: string;
  isJobSeeker: boolean;
  isProfile: boolean;
  listProfileAs?: string;
}

interface Props {
  data: RowData[];
}

const Dashboard: React.FC<Props> = ({ data }) => {
  const adminServices = new AdminServices();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };
  const router = useRouter();

  const [SeekerDetails, setDetails] = useState<any[]>([]); // State to hold the fetched data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [filterText, setFilterText] = useState<string>(""); // State to handle search filter
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<IUserProfileModel | null>(null);
  const [profile, setProfile] = useState<IUserProfileModel | null>(null);
  const [onLoad, setOnload] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const { isActive } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const AdminId = process.env.NEXT_PUBLIC_ADMIN_ID;
  const [selectedTab, setSelectedTab] = useState("users");
  const [contactDetails, setContactDetails] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [emailList, setEmailList] = useState<number>(0);
  const [jobSeekerCount, setJobSeekerCount] = useState<number>(0);
  const [profileCount, setProfileCount] = useState<number>(0);
  const handleShowSignup = () => setShowSignup(true);
  const handleCloseSignup = () => setShowSignup(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleModalClose = () => {
    setShowJobModal(false);
    setSelectedRow(null);
  };

  const handleModalOpen = (row: any) => {
    setSelectedRow(row);
    setShowJobModal(true);
  };
  const handleJobSeekerUpdate = (email: string) => {
    window.location.reload();
  };
  const roleStatus = Cookies.get(cookieParams.role);
  const fetchAllJobs = async () => {
    try {
      const fetchedDetails: IUsers[] =
        await adminServices.fetchAdminDashboardPageUsers();
      if (Array.isArray(fetchedDetails[1])) {
        const emailList = fetchedDetails[1].map((item) => item.email).length;
        const jobSeekerCount = fetchedDetails[1].filter(
          (item: any) => item.listProfileAs === "Service Provider" || item.listProfileAs === "Both"
        ).length;
        const profileCount = fetchedDetails[1].filter(
          (item) => item.isProfile === true
        ).length;

        setDetails(fetchedDetails[1]);
        setEmailList(emailList);
        setJobSeekerCount(jobSeekerCount);
        setProfileCount(profileCount);
      }

      setIsInitialRender(false);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const fetchedDetails = await ApiService.crud(
        APIDetails.AdminContactDetails
      );
      if (fetchedDetails[0] === true) {
        setContactDetails(fetchedDetails.slice(1));
      }
      setIsLoading(false);
    };
    fetchDetails();
  }, []);

  // Filter rows based on the search input
  // Flatten the contactDetails array if it contains nested arrays
  const flatContactDetails = Array.isArray(contactDetails[0])
    ? contactDetails[0]
    : contactDetails;

  const filteredData = flatContactDetails.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.issueType?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBuild = (email: string) => {
    router.push({
      pathname: Routes.AdminBuildUserDetails,
      query: { email }, // passing email as a query parameter
    });
  };

  const handleEdit = (email: string, isJobseeker: boolean) => {
    getProfile(email, isJobseeker);
  };

  const getProfile = async (email: string, isJobseeker: boolean) => {
    try {
      const result = await ApiService.crud(APIDetails.AdminViewUser, email);
      if (result[0] === true) {
        setProfile(result[1] as IUserProfileModel);
        goToEditProfile(result[1] as IUserProfileModel, isJobseeker); // Pass profile to edit page
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setOnload(false);
    }
  };

  const goToEditProfile = (
    profile: IUserProfileModel,
    isJobseeker: boolean
  ) => {
    const queryData = JSON.stringify(profile);
    router.push({
      pathname: Routes.AdminEditUserDetails,
      query: {
        queryData,
        isJobseeker: isJobseeker ? "true" : "false", // Convert to string for URL
      },
    });
  };

  // Define the columns for the DataTable
  const columns = [
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      minWidth: "300px",
      cell: (row: any) => (
        <div className={styles.scrollableDescription}>{row.email}</div>
      ),
    },
    {
      name: "First Name",
      selector: (row: any) => row.firstName || "-",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: any) => row.lastName || "-",
      sortable: true,
    },
    {
      name: "List Profile As",
      sortable: true,
      minWidth: "180px",
      cell: (row: any) =>
        row.listProfileAs ? (
          <span className={`${style.profileBadge} ${row.listProfileAs === 'Both' ? style.badgeBoth :
            row.listProfileAs === 'Service Provider' ? style.badgeProvider :
              style.badgeSeeker
            }`}>
            {row.listProfileAs}
          </span>
        ) : (
          <>
            {row.roles?.includes(Roles.Admin) ? (
              <span className={`${style.profileBadge} ${style.badgeNA}`}>Admin</span>
            ) : row.roles?.includes(Roles.SubAdmin) ? (
              <span className={`${style.profileBadge} ${style.badgeNA}`}>SubAdmin</span>
            ) : (
              <label className={style.seekerCheckLabel}>
                <input
                  type="checkbox"
                  onClick={() => handleModalOpen(row)}
                />
                Make them seeker
              </label>
            )}
          </>
        ),
    },
    {
      name: "Build Profile Status",
      selector: (row: any) => (row.isProfile ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      sortFunction: (a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      },
    },

    {
      name: "Actions",
      cell: (row: any) => (
        // <DropdownButton
        //   id={`${row.email}`}
        //  // className="bgSecondary mobileOffCanvasButtons"
        //   title={<FaEllipsisVertical />}
        //  // variant="outline-light"
        //   size="sm"
        // >
        <Dropdown>
          <Dropdown.Toggle
            id={`${row.email}`}
            size="sm"
            className={`${style.navbar}`}
            variant="outline-light"
          >
            <FaEllipsisVertical
              className="align-items-center"
              style={{ color: "black" }}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {row.isProfile ? (
              <>
                <Dropdown.Item onClick={() => handleView(row.email)}>
                  <FontAwesomeIcon icon={faEye} className="me-2" /> View
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleEdit(row.email, row.isJobSeeker)}
                >
                  <PencilSquare size={20} className="me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handlePostClick(row.email)}>
                  <FontAwesomeIcon icon={faPlusSquare} className="me-2" />{" "}
                  PostAJob
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleMyPostClick(row.email)}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Posted Jobs
                </Dropdown.Item>
                {roleStatus && !roleStatus.includes(Roles.SubAdmin) && (
                  <Dropdown.Item
                    onClick={() => handleDelete(row.email)}
                    className="text-danger"
                  >
                    <Trash size={20} className="me-2" /> Delete
                  </Dropdown.Item>
                )}
              </>
            ) : (
              <>
                {row.roles?.includes(Roles.Admin) ? (
                  <Dropdown.Item disabled>Admin</Dropdown.Item>
                ) : row.roles?.includes(Roles.SubAdmin) ? (
                  <Dropdown.Item disabled>SubAdmin</Dropdown.Item>
                ) : (
                  <>
                    {roleStatus && !roleStatus.includes(Roles.SubAdmin) && (
                      <Dropdown.Item
                        onClick={() => handleDelete(row.email)}
                        className="text-danger"
                      >
                        <Trash size={20} className="me-2" /> Delete
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => handleBuild(row.email)}>
                      <FontAwesomeIcon icon={faUser} className="me-2" /> Build
                      Profile
                    </Dropdown.Item>
                  </>
                )}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const Contactcolumns = [
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      cell: (row: any) => (
        <span style={{ whiteSpace: "nowrap" }}>{row.email}</span>
      ),
    },
    { name: "Role", selector: (row: any) => row.role, sortable: true },

    {
      name: "Issue Type",
      selector: (row: any) => row.issueType,
      sortable: true,
    },
    {
      name: "Issue Description",
      selector: (row: any) => row.issueDescription,
      cell: (row: any) => (
        <div
          style={{
            overflowX: "auto", // Enables horizontal scroll
            whiteSpace: "nowrap", // Prevents text from wrapping
            maxWidth: "300px", // Set a max width to constrain the column width
          }}
        >
          {row.issueDescription}
        </div>
      ),
    },
    {
      name: "Created On",
      selector: (row: any) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];

  // Filter logic for search
  const filteredItems = SeekerDetails.filter(
    (item) =>
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.firstName &&
        item.firstName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastName &&
        item.lastName.toLowerCase().includes(filterText.toLowerCase()))
  );
  // Handler for Edit button
  const handleView = async (email: string) => {
    try {
      const fetchedUserData = await ApiService.crud(
        APIDetails.AdminViewUser,
        email
      );
      if (fetchedUserData) {
        setUserData(fetchedUserData[1] as IUserProfileModel);
        setShowModal(true);
      } else {
        console.error("No user data received");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserData(null);
  };

  const handleDelete = async (email: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiService.crud(APIDetails.AdminDeleteUser, email);
        if (response[0]) {
          setDetails(SeekerDetails.filter((item) => item.email !== email));
          toast.success(response[1].message || "User deleted successfully");
        } else {
          toast.error(`Error occurred: ${response[1].message}`);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleMapViewClick = () => {
    if (!isActive) {
      toast.info("Please login to find helpers in your area");
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } else {
      //router.push(Routes.mapSearch);
      router.push(Routes.AdminDashboard);
    }
  };

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
  };
  const [activeTab, setActiveTab] = useState("users");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    handleTabSelect(tab);
  };

  const handlePostClick = (email: string) => {
    router.push({
      pathname: Routes.AdminJobPost,
      query: { email }, // passing email as a query parameter
    });
  };
  const handleMyPostClick = (email: string) => {
    router.push({
      pathname: Routes.myPostedJobs,
      query: { email }, // passing email as a query parameter
    });
  };

  const handleExport = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Extract specific fields and format the data
    const formattedData = filteredItems.map(item => ({
      UserID: item.id,
      Email: item.email,
      ListProfileAs: item.listProfileAs || "Both",
      BuildProfileStatus: item.isProfile,
      Roles: item.roles.join(", "),
      socialLogin: item.socialLogin,
      IsDeleted: item.isDeleted,
      createdByAdmin: item.createdByAdmin,
      RegisteredOn: new Date(item.createdAt).toLocaleDateString(),
      UpdatedOn: new Date(item.updatedAt).toLocaleDateString(),
    }));

    exportToExcel(formattedData, `DesihelpersUsers_${formattedDate}.xlsx`);
  };



  return (
    <div className={style.dashboardWrapper}>
      {/* ── Mobile Overlay ── */}
      {isSidebarOpen && (
        <div className={style.mobileOverlay} onClick={toggleSidebar}></div>
      )}

      {/* ── Top Bar ── */}
      <div className={style.topBar}>
        <div className={style.topBarTitle}>
          <button className={style.mobileMenuBtn} onClick={toggleSidebar}>
            <FaBars />
          </button>
          {roleStatus === "subadmin" ? "Welcome, " : "Welcome, "}
          <span>{roleStatus === "subadmin" ? "SubAdmin" : "Admin"}</span>
        </div>
        <button className={style.addUserBtn} onClick={handleShowSignup}>
          <FaPlus size={14} /> Add User
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className={style.mainContent}>
        {/* ── Sidebar ── */}
        <div className={`${style.sidebar} ${isSidebarOpen ? style.sidebarExpanded : ""}`}>
          <button className={style.sidebarToggle} onClick={toggleSidebar}>
            <FaBars size={18} />
          </button>

          <button
            className={`${style.sidebarLink} ${selectedTab === "users" ? style.sidebarLinkActive : ""}`}
            onClick={() => { handleTabSelect("users"); closeSidebarOnMobile(); }}
          >
            <span className={style.sidebarIcon}><FaUsers /></span>
            <span className={`${style.sidebarLabel} ${isSidebarOpen ? style.sidebarLabelVisible : ""}`}>
              User List
            </span>
          </button>

          <button
            className={`${style.sidebarLink} ${selectedTab === "contactedUsers" ? style.sidebarLinkActive : ""}`}
            onClick={() => { handleTabSelect("contactedUsers"); closeSidebarOnMobile(); }}
          >
            <span className={style.sidebarIcon}><FaPhoneAlt /></span>
            <span className={`${style.sidebarLabel} ${isSidebarOpen ? style.sidebarLabelVisible : ""}`}>
              Contacted Users
            </span>
          </button>
        </div>

        {/* ── Content Panel ── */}
        <div className={style.contentPanel}>
          {/* ── Stat Cards ── */}
          <div className={style.statsRow}>
            <div className={`${style.statCard} ${style.statCardBlue}`}>
              <div className={style.statInfo}>
                <span className={style.statLabel}>Registered Users</span>
                <span className={style.statValue}>{emailList}</span>
              </div>
              <div className={`${style.statIcon} ${style.statIconBlue}`}>
                <FaUserFriends />
              </div>
            </div>

            <div className={`${style.statCard} ${style.statCardTeal}`}>
              <div className={style.statInfo}>
                <span className={style.statLabel}>Service Providers</span>
                <span className={style.statValue}>{jobSeekerCount}</span>
              </div>
              <div className={`${style.statIcon} ${style.statIconTeal}`}>
                <FaUser />
              </div>
            </div>

            <div className={`${style.statCard} ${style.statCardOrange}`}>
              <div className={style.statInfo}>
                <span className={style.statLabel}>Built Profiles</span>
                <span className={style.statValue}>{profileCount}</span>
              </div>
              <div className={`${style.statIcon} ${style.statIconOrange}`}>
                <FaUserPlus />
              </div>
            </div>
          </div>

          {/* ── Tab Navigation (mobile-friendly) ── */}
          <div className={style.tabNav}>
            <button
              className={`${style.tabBtn} ${selectedTab === "users" ? style.tabBtnActive : ""}`}
              onClick={() => handleTabSelect("users")}
            >
              <FaUsers size={15} /> Users
            </button>
            <button
              className={`${style.tabBtn} ${selectedTab === "contactedUsers" ? style.tabBtnActive : ""}`}
              onClick={() => handleTabSelect("contactedUsers")}
            >
              <FaPhoneAlt size={14} /> Contacted
            </button>
          </div>

          {/* ── Users Tab ── */}
          {selectedTab === "users" && (
            <div className={style.tablePanel}>
              <div className={style.tablePanelHeader}>
                <div className={style.tablePanelTitle}>
                  <FaUsers style={{ color: "#06b9a3" }} /> User Details
                </div>
                <div className={style.tablePanelActions}>
                  <input
                    type="text"
                    className={style.searchInput}
                    placeholder="Search by name or email..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  <button className={style.exportBtn} onClick={handleExport}>
                    <FaFileExport /> Export
                  </button>
                </div>
              </div>
              <div className={style.tablePanelBody}>
                <DataTable
                  columns={columns}
                  pagination
                  data={filteredItems}
                  highlightOnHover
                  responsive
                  paginationPerPage={100}
                  paginationComponentOptions={{
                    rowsPerPageText: "Rows per page:",
                  }}
                  paginationRowsPerPageOptions={[100, 150, 200, 250]}
                />
              </div>
            </div>
          )}

          {/* ── Contacted Users Tab ── */}
          {selectedTab === "contactedUsers" && (
            <div className={style.tablePanel}>
              <div className={style.tablePanelHeader}>
                <div className={style.tablePanelTitle}>
                  <FaPhoneAlt style={{ color: "#FF812B" }} /> Contacted Users
                </div>
                <div className={style.tablePanelActions}>
                  <input
                    type="text"
                    className={style.searchInput}
                    placeholder="Search by name, email, or issue..."
                    value={searchText}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className={style.tablePanelBody}>
                <DataTable
                  columns={Contactcolumns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  responsive
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <UserModal
        show={showModal}
        userData={userData}
        handleClose={handleCloseModal}
      />
      <AdminSignUpModal show={showSignup} handleClose={handleCloseSignup} />
      <UpdateJobSeekerStatus
        show={showJobModal}
        onClose={handleModalClose}
        onConfirm={handleJobSeekerUpdate}
        userId={selectedRow?.email || null}
      />
    </div>
  );
};

export default Dashboard;
