import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ApiService from "@/services/data/crud/crud";
import DataTable from "react-data-table-component";
import { Form, Container, Row, Col, Button, Card } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import UserModal from "@/components/admin/ViewUserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "@/services/routes/Routes";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useAuth } from "@/services/authorization/AuthContext";
import AdminSignUpModal from "@/components/admin/AdminSignUpModal";
import { FaUser } from "react-icons/fa";
import Roles from "@/constants/ERoles";
//import UpdateJobSeekerStatus from "@/components/admin/UpdateJobSeekerStatus";
import styles from "@/styles/UserProfiles.module.css"

const UserDetails = () => {
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
  const handleShowSignup = () => setShowSignup(true);
  const handleCloseSignup = () => setShowSignup(false);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const fetchedDetails = await ApiService.crud(APIDetails.AdminUserDetails);
        if (fetchedDetails[0] === true && Array.isArray(fetchedDetails[1])) {
          setDetails(fetchedDetails[1]);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllJobs();
  }, []);
  

  const handleBuild = (email: string) => {
    router.push({
      pathname: Routes.AdminBuildUserDetails,
      query: { email }, 
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
        goToEditProfile(result[1] as IUserProfileModel, isJobseeker);
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
        isJobseeker: isJobseeker ? "true" : "false", 
      },
    });
  };
  const columns = React.useMemo(() => [
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      minWidth: "300px", 
      cell: (row: any) => (
        <div className={styles.scrollableDescription}>
        {row.email}
      </div>
      
      )
    },
   {
      name: 'First Name',
      selector: (row: any) => row.firstName  || "-",
      sortable: true,
      minWidth: "180px", 
    },
    {
      name: 'Last Name',
      selector: (row: any) => row.lastName  || "-",
      sortable: true,
      minWidth: "180px", 
    },
    {
      name: "Job Seeker Status",
      selector: (row: any) => (row.isJobSeeker ? "Yes" : "No"),
      sortable: true,
      minWidth: "180px", 
    },
    {
      name: "Build Profile Status",
      selector: (row: any) => (row.isProfile ? "Yes" : "No"),
      sortable: true,
      minWidth: "180px", 
    },
    {
      name: "Created On",
      selector: (row: any) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      minWidth: "250px", 
    },
    {
      name: "Actions",
      cell: (row: any) =>
        row.isProfile ? (
          <>
            {" "}
            <div>
              <FontAwesomeIcon
                icon={faEye}
                size="lg"
                className="me-2 text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => handleView(row.email)}
              />
              <PencilSquare
                size={20}
                className="me-2 text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(row.email, row.isJobSeeker)}
              />
              <Trash
                size={20}
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(row.email)}
              />
            </div>
          </>
        ) : (
          <>
          {row.roles?.includes(Roles.Admin) ? (
            <span>Admin</span>
          ) : (
            <>
              <Trash
                size={20}
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(row.email)}
              />
              <FaUser
                size={20}
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => handleBuild(row.email)}
              />
            </>
          )}
        </>
        
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], []);

  // Filter logic for search
  const filteredItems = SeekerDetails.filter(
    (item) =>
      item.email && item.email.toLowerCase().includes(filterText.toLowerCase())||
    item.firstName && item.firstName.toLowerCase().includes(filterText.toLowerCase())||
    item.lastName && item.lastName.toLowerCase().includes(filterText.toLowerCase())
  );

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
        const response = await ApiService.crud(
          APIDetails.AdminDeleteUser,
          email
        );
        if (response[0]){
          setDetails(SeekerDetails.filter((item) => item.email !== email));
          alert(response[1].message)
        }
        else{
          alert(`Error occured : ${response[1].message}`)
        }
    }
  };

  // const handleMapViewClick = () => {
  //     //router.push(Routes.mapSearch);
  //     router.push(Routes.AdminDashboard);
  // };

  //     const handlePostClick = (email: string) => {
  //       router.push({
  //         pathname: Routes.AdminJobPost,
  //         query: { email }, // passing email as a query parameter
  //       });
  //     };
  //     const handleMyPostClick = (email: string) => {
  //       router.push({
  //         pathname: Routes.AdminJobPost,
  //         query: { email }, // passing email as a query parameter
  //       });
  //     };


  return (
    <Container fluid style={{ marginTop: "80px" }}>
      <Row className="my-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center bgPrimary text-white">
              <h5 className="mb-0">User Management</h5>
              {/* <Button variant="outline-light" onClick={handleShowSignup}>
                Add User
              </Button> */}
               {/* <Button variant="outline-light" onClick={handleMapViewClick}>
                Dashboard
              </Button> */}
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={12} sm={6} md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="mb-3"
                  />
                </Col>
              </Row>
              <DataTable
                title="User Details"
                columns={columns}
                data={filteredItems}
                striped
                highlightOnHover
                responsive
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
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <UserModal
        show={showModal}
        userData={userData}
        handleClose={handleCloseModal}
      />
      <AdminSignUpModal show={showSignup} handleClose={handleCloseSignup} />
    </Container>
  );
};

export default UserDetails;
