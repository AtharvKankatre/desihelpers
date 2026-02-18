import { FunctionComponent } from "react";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { Card, CardFooter, ListGroup } from "react-bootstrap";

type Props = {
  seeker: IUserProfileModel;
  setModal: boolean;
  toggleModal: () => void;
};

export const CSeekerPin: FunctionComponent<Props> = ({ seeker }) => {
  return (
    <Card className="mapPinCardMain">
      <Card.Header className="fw-bold mapPinCardHeader">
        {seeker.displayName}
      </Card.Header>
      <Card.Body className="mapPinCardBody">
        <div className="fw-bold mb-1">{"Available for : "}</div>
        <ListGroup>
          {seeker.jobDetails?.map((e) => (
            <div key={e.subCategory} className="d-flex flex-row">
              <img src={e.icons} height={16} className="me-1" />
              <div>{e.subCategory}</div>
            </div>
          ))}
        </ListGroup>
      </Card.Body>
      <CardFooter className="mapPinCardFooter textSecondary">
        View Full Profile
      </CardFooter>
    </Card>
  );
};
