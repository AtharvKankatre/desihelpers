import { FunctionComponent } from "react";
import { Image, ListGroup, ListGroupItem } from "react-bootstrap";

type Props = {
  heading: string;
  label:React.ReactNode;
  icon?: string;
  className?: string;
  hideIcon?: boolean;
  isRounded?: boolean;
};

export const CDisplay: FunctionComponent<Props> = ({ ...Props }) => (
  <div className={Props.className}>
    <ListGroup horizontal className="align-items-center mb-3 bgTransparent">
      {Props.hideIcon == true ? null : (
        <ListGroupItem className="displayIconHeadingLabel pe-3 bgTransparent">
          <Image
            src={Props.icon}
            height={22}
            width={22}
            roundedCircle={Props.isRounded ?? false}
          />
        </ListGroupItem>
      )}
      <ListGroupItem className="displayIconHeadingLabel bgTransparent">
        <ListGroup className="bgTransparent">
          <ListGroupItem className="displayIconHeadingLabel displayIconHeadingLabel_heading bgTransparent">
            {Props.heading}
          </ListGroupItem>
          <ListGroupItem className="displayIconHeadingLabel displayIconHeadingLabel_label bgTransparent">
            {Props.label}
          </ListGroupItem>
        </ListGroup>
      </ListGroupItem>
    </ListGroup>
  </div>
);
