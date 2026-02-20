import { FunctionComponent } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Image from "next/image";

type Props = {
  heading: string;
  label: React.ReactNode;
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
          <div style={{ position: 'relative', width: '22px', height: '22px' }}>
            <Image
              src={Props.icon || "/assets/icons/icon_help.svg"}
              alt={Props.heading}
              fill
              style={{
                objectFit: 'contain',
                borderRadius: Props.isRounded ? '50%' : '0'
              }}
            />
          </div>
        </ListGroupItem>
      )}
      <ListGroupItem className="displayIconHeadingLabel bgTransparent">
        <ListGroup className="bgTransparent">
          <ListGroupItem className="displayIconHeadingLabel displayIconHeadingLabel_heading bgTransparent body-small-bold">
            {Props.heading}
          </ListGroupItem>
          <ListGroupItem className="displayIconHeadingLabel displayIconHeadingLabel_label bgTransparent body-medium-regular">
            {Props.label}
          </ListGroupItem>
        </ListGroup>
      </ListGroupItem>
    </ListGroup>
  </div>
);
