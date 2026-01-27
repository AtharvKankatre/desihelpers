import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Navbar,
  Nav,
  Collapse,
  Button,
  Form,
  Card,
  OverlayTrigger,
  Tooltip,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import {
  FaBars,
  FaFileExcel,
  FaFileExport,
  FaPhoneAlt,
  FaPlus,
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
import { FaUser } from "react-icons/fa";
import Roles from "@/constants/ERoles";
import { CH4Label } from "@/components/reusable/labels/CH4Label";
import CCards from "@/components/reusable/CCards";
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
}

interface Props {
  data: RowData[];
}

const Dashboard: React.FC<Props> = ({ data }) => {
  const adminServices = new AdminServices();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
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
          (item) => item.isJobSeeker === true
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
      name: "Job Seeker Status",
      sortable: true,
      minWidth: "180px",
      cell: (row: any) =>
        row.isJobSeeker ? (
          "Yes"
        ) : (
          <>
            {row.roles?.includes(Roles.Admin) ? (
              <span>N/A</span>
            ) : row.roles?.includes(Roles.SubAdmin) ? (
              <span>N/A</span>
            ) : (
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  onClick={() => handleModalOpen(row)} // Open modal when clicked
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
          Swal.fire("Deleted!", response[1].message, "success");
        } else {
          Swal.fire("Error", `Error occurred: ${response[1].message}`, "error");
        }
      } catch (error) {
        Swal.fire("Error", "An unexpected error occurred.", "error");
      }
    }
  };

  const handleMapViewClick = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to find helpers in your area",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
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
      JobSeekerStatus: item.isJobSeeker,
      BuildProfileStatus : item.isProfile,
      Roles: item.roles.join(", "),
      socialLogin: item.socialLogin,
      IsDeleted: item.isDeleted,
      createdByAdmin : item.createdByAdmin,
      RegisteredOn: new Date(item.createdAt).toLocaleDateString(),
      UpdatedOn: new Date(item.updatedAt).toLocaleDateString(),
    }));
  
    exportToExcel(formattedData, `DesihelpersUsers_${formattedDate}.xlsx`);
  };
  
  

  return (
    <>
      <div style={{ marginTop: "50px" }}>
        <Navbar
          className="d-flex   justify-content-start align-items-center bgPrimary text-white navbar-expand-xl"
          style={{ width: "100vw", margin: 0, padding: 10 }}
          variant="dark"
          expand="xl"
        >
          <Navbar.Brand href="#" style={{ marginLeft: "25px" }}>
            {roleStatus === "subadmin"
              ? "Welcome, SubAdmin!"
              : "Welcome, Admin!"}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <div
            className="collapse navbar-collapse"
            id="navbarTogglerDemo02"
          ></div>

          <Button variant="outline-light" onClick={handleShowSignup}>
            <FaPlus /> Add User
          </Button>
        </Navbar>

        <Row>
          {/* Collapsible Sidebar */}
          <Col
            md={isSidebarOpen ? 2 : 1}
            className={`sidebar bgPrimary text-white d-flex flex-column align-items-center p-0`}
            style={{ minHeight: "100vh" }}
          >
            <Button
              onClick={toggleSidebar}
              className=" bgPrimary"
              //aria-controls="sidebar-nav"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <FaBars /> : <FaBars />}
            </Button>

            <Nav defaultActiveKey="/admin/users" className="flex-column">
              <Nav.Link
                href="#"
                onClick={() => handleTabSelect("users")}
                className="text-white d-flex align-items-center"
              >
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-users">User List</Tooltip>}
                >
                  <FaUsers size={20} className="me-2" />
                </OverlayTrigger>
                <Collapse in={isSidebarOpen}>
                  <span>User List</span>
                </Collapse>
              </Nav.Link>

              <Nav.Link
                href="#"
                onClick={() => handleTabSelect("contactedUsers")}
                className="text-white d-flex align-items-center"
              >
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="tooltip-contacted-users">
                      Contacted Users
                    </Tooltip>
                  }
                >
                  <FaPhoneAlt size={20} className="me-2" />
                </OverlayTrigger>
                <Collapse in={isSidebarOpen}>
                  <span>Contacted Users</span>
                </Collapse>
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={isSidebarOpen ? 10 : 11} className="p-4">
            <Row>
              {/* <div>
                <CStats />
              </div> */}
              <Col md={4}>
                <CCards
                  cardHeader="Registered Users"
                  cardTitle={emailList}
                  cardText=""
                  cardColor="#FFFFFF"
                  titleColor="dark"
                  Icons={<FaUserFriends />}
                />
              </Col>

              <Col md={4}>
                <CCards
                  cardHeader="Total Service Providers"
                  cardTitle={jobSeekerCount}
                  cardText=""
                  cardColor="#FFFFFF"
                  titleColor="dark"
                  Icons={<FaUser />}
                />
              </Col>
              <Col md={4}>
                <CCards
                  cardHeader="Total Build Profiles"
                  cardTitle={profileCount}
                  cardText=""
                  cardColor="#FFFFFF"
                  titleColor="dark"
                  Icons={<FaUserPlus />}
                />
              </Col>
            </Row>
            <Card.Body>
              {selectedTab === "users" && (
                <div>
                  <CH4Label label={"User Details"}></CH4Label>
                  <Row className="mb-3">
                    <Col xs={12} sm={6} md={4}>
                      <Form.Control
                        type="text"
                        placeholder={`Search...`}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="mb-3"
                      />
                    </Col>
                  </Row>
                  <div style={{ textAlign: "right", marginBottom: "10px" }}>
                    {/* Add Export to Excel Button */}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="export-tooltip">Excelsheet</Tooltip>
                      }
                    >
                      <button
                        onClick={handleExport}
                        className="btn bgSecondary text-white"
                      >
                        Export Data <FaFileExport/>
                      </button>
                    </OverlayTrigger>
                  </div>
                  <DataTable
                    //title=""
                    columns={columns}
                    pagination
                    data={filteredItems}
                    striped
                    highlightOnHover
                    responsive
                    customStyles={{
                      headRow: {
                        style: {
                          backgroundColor: "#E5FCFF",
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
                  paginationPerPage={100} // Set default rows per page
              paginationComponentOptions={{
                rowsPerPageText: 'Rows per page:',
              }}
              paginationRowsPerPageOptions={[100, 150, 200,250]} // Options for rows per page
                  />
                </div>
              )}
              {selectedTab === "contactedUsers" && (
                <div>
                  <CH4Label label={"Contacted Users"}></CH4Label>
                  <Row className="mb-3">
                    <Col xs={12} sm={6} md={4}>
                      <Form.Control
                        type="text"
                        placeholder={`Search...`}
                        value={searchText}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => setSearchText(e.target.value)}
                        className="mb-3"
                      />
                    </Col>
                  </Row>
                  <DataTable
                    columns={Contactcolumns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    customStyles={{
                      headRow: {
                        style: {
                          backgroundColor: "#E5FCFF",
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
                  />
                </div>
              )}
            </Card.Body>
          </Col>
        </Row>
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
    </>
  );
};

export default Dashboard;
