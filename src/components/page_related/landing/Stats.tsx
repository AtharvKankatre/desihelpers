import React, { useEffect, useState } from "react";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";

// Initial stats
const initialStats = [
  { value: "100+", label: "Daily Visitors" },
  { value: "100+", label: "Number of members" },
  { value: "25+", label: "Types of helper categories" },
];

const CStats: React.FC = () => {
  const [stats, setStats] = useState(initialStats);
  const { tablet } = useAppMediaQuery();

  useEffect(() => {
    const fetchMemberCount = async () => {
      const response = await ApiService.crud(APIDetails.countMembers);
      if (response[0]) {
        const memberCount = response[1] || "100+";
        setStats((prevStats) =>
          prevStats.map((stat) =>
            stat.label === "Number of members"
              ? { ...stat, value: memberCount }
              : stat
          )
        );
      } else {
        console.log("No stats");
      }
    };

    fetchMemberCount();
  }, []);

  return (
    <Container className="mt-4 mb-4 p-4 bg-light rounded mx-auto" fluid>
      <Row className="text-center justify-content-center">
        {stats.map((stat, index) => (
          <Col xs={12} sm={4} xl={3} key={index} className="mb-3">
            <Card className="border-0 text-center w-100 h-100">
              <Card.Body className="h-100">
                <Card.Title className="landingPageStats">
                  {stat.value}
                </Card.Title>
                <Card.Text style={{ color: "#6c757d", fontSize: "16px" }}>
                  {stat.label}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CStats;
