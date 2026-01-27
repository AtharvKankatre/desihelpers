import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import styles from "@/styles/Landing.module.css";

const StyledLink = styled("a")(({ theme }) => ({
  display: "block",
  marginTop: theme.spacing(2),
  color: "orange",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const AboutUs = () => {
  return (
    <div className={`container-fluid `} style={{ paddingTop: "80px" }}>
      <div className={`row justify-content-center`}>
        <div className="col-md-8">
          <Typography variant="h4" sx={{ mb: 4 }}>
            About Us
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Why Choose Our Platform?
            </Typography>
            <Typography variant="body1">
              Look around your house and the help you need so you can relax.
              Then look at how much effort it takes to find one helper today? We
              solve it for you and at no cost to you. We are the first ever
              created socio-economic platform to connect people looking to help
              each other in and around the community.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              The Problem We Are Solving
            </Typography>
            <Typography variant="body1">
              We have seen a fundamental shift in hiring household help in our
              communities. People are looking for nannies, personal chefs,
              caterers, tutors at record high levels than ever before in this
              country. They use different social channels to spread the need or
              show that they are available to hire in hope that they might hear
              back soon. Through our research and personal experiences, we
              realized these social media solutions available today were not
              meant for such use. Every poster to seeker connection, the poster
              has to at least post in 8-12 different channels (Social Media
              groups, messaging groups, and phone-a-friend). Then they have to
              repost every day to keep their listings on top of everyones mind,
              wasting their valuable time, creating e-waste to get any quality
              leads. Many leads are lost as the poster doesnt check messengers
              actively. Seekers on the other hand have to be vigilant and
              actively monitor these groups or be well connected with others to
              find leads. The result is a huge loss of productivity and income.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              How Are We Solving It
            </Typography>
            <Typography variant="body1">
              We are passionate to solve this in a scalable way. One platform
              for all of our helper needs around the house. Ideally, if you are
              a poster, you will see active profiles in your area who are
              looking for work and be able to directly connect with them without
              needing to post a requirement. If you are a seeker, you will be
              able to see active helper needs in the area you want to work in
              without having to use any other groups or messengers you had to
              use in the past.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Why Is It Free?
            </Typography>
            <Typography variant="body1">
              We believe that with a certain number of active users on the
              website we will be able to sustain the development and operational
              costs for the platform with advertisement revenues without
              requiring to charge our users. Our request to you is to join our
              mission and share our platform with all of your friends,
              co-workers, and others so we can continue to keep it free for many
              more years to come.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Do I Need to Provide SSN Like Sensitive Information?
            </Typography>
            <Typography variant="body1">
              No, we do not request any such information like SSN or credit
              cards from our users. We will not call you for any such
              information as well. The help opportunity is between the two
              parties which occurs outside of the platform with no monetary or
              any kind of benefit to DesiHelpers.com.
            </Typography>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
