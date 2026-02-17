import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ApiService from "@/services/data/crud/crud";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Container, Form, Row } from "react-bootstrap";

const ContactUsDetails = () => {
  const router = useRouter();
  const [contactDetails, setContactDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

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

  const columns = [
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      cell: (row: any) => (
        <span style={{ whiteSpace: "nowrap" }}>{row.email}</span>
      ),
    },
    { name: "Issue Description", selector: (row: any) => row.issueDescription },
    {
      name: "Issue Type",
      selector: (row: any) => row.issueType,
      sortable: true,
    },
    { name: "Role", selector: (row: any) => row.role, sortable: true },
    {
      name: "Created At",
      selector: (row: any) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid style={{ marginTop: "80px" }}>
      <Row className="my-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center bgPrimary text-white">
              <h5 className="mb-0">Contact Us Details</h5>
              {/* <Button variant="outline-light" onClick={handleShowSignup}>
          Add User
        </Button> */}
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={12} sm={6} md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setSearchText(e.target.value)}
                    className="mb-3"
                  />
                </Col>
              </Row>
              <DataTable
                columns={columns}
                data={filteredData}
                // pagination
                highlightOnHover
                striped
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
    </Container>
  );
};

export default ContactUsDetails;
