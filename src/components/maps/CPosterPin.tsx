import { FunctionComponent } from "react";
import { Card, CardFooter, ListGroup, ListGroupItem } from "react-bootstrap";
import { IJobs } from "@/models/Jobs";
import { CH5Label } from "../reusable/labels/CH5Label";
import { formatDate } from "@/services/functions/FormatDate";

type Props = {
  job: IJobs;
  setModal: boolean;
  toggleModal: () => void;
};

export const CPosterPin: FunctionComponent<Props> = ({ job }) => {
  return (
    <Card className="mapPinCardMain">
      <Card.Header className="fw-bold mapPinCardHeader">
        <Card.Title> {job.subCategory ?? "-"}</Card.Title>
      </Card.Header>
      <Card.Body className="mapPinCardBody">
        <ListGroup className="displayIconHeadingLabel">
          <ListGroupItem className="displayIconHeadingLabel">{`Start Date : ${formatDate(
            job.startDate?.toString()
          )}`}</ListGroupItem>
          <ListGroupItem className="displayIconHeadingLabel">{`Posted by : ${
            job.userProfile?.displayName ?? "-"
          }`}</ListGroupItem>
        </ListGroup>
      </Card.Body>
      <CardFooter className="mapPinCardFooter textSecondary">
        View Details
      </CardFooter>
    </Card>
  );
};
