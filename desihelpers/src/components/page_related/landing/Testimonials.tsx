import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Rating from "@mui/material/Rating";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import styles from "@/styles/Common.module.css";

interface Testimonial {
  name: string;
  location: string;
  role: string;
  testimonial: string;
  imageUrl: string;
  rating: number;
}

const Ctestimonials: Testimonial[] = [
  {
    name: "Seetha Iyer",
    location: "Seattle, WA",
    role: "Nanny",
    testimonial: `Finding helper is so easy on this site. I found one in less than 24 hours. I use this site regularly for babysitting, finding tutors in my area, cleaning help and birthday photographer. Thanks DH. 5-star reviews.`,
    imageUrl: "/assets/icons/icon_baby.svg",
    rating: 5,
  },
  {
    name: "Swaroop A",
    location: "San Diego, CA",
    role: "Personal Chef",
    testimonial: `It is so easy to find customers who are close to you and save on travel time and money. I am no longer posting my ad on Facebook. Thanks DH`,
    imageUrl: "/assets/icons/icon_cook.svg",
    rating: 4,
  },
  {
    name: "Surinder Kaur",
    location: "Nashville, TN",
    role: "Nanny",
    testimonial: `The active profile feature helps me manage my schedule. Jab jaroorat hai, I turn the profile on so people can contact me. Thank you DesiHelper team. Life is so easy now`,
    imageUrl: "/assets/icons/icon_baby.svg",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="container">
      <CH2Label
        className={`col-md-12 text-center mb-5 ${styles.pLabel}`}
        label="Testimonials"
      />
      <div className="row">
        {Ctestimonials.map((Ctestimonial, index) => (
          <Col xs={12} md={12} xl={4} key={index} className="mb-4">
            <Card
              className={`h-100 shadow-sm border-0 ${styles.cardHoverEffect}`}
            >
              <Card.Body>
                <div className="d-flex align-items-start mb-3">
                  <div className={styles.cardProfilePhoto}>
                    <img src={Ctestimonial.imageUrl} alt={Ctestimonial.name} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <strong className="me-1">{Ctestimonial.name}</strong>
                      {Ctestimonial.role && (
                        <span className="text-muted">
                          ({Ctestimonial.role})
                        </span>
                      )}
                    </div>
                    <div className="text-teal">{Ctestimonial.location}</div>
                    {/* <Rating
                      name="read-only"
                      value={Ctestimonial.rating}
                      readOnly
                    /> */}
                  </div>
                </div>
                <Card.Text className={styles.bodyText}>
                  {`‟${Ctestimonial.testimonial}”`}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
