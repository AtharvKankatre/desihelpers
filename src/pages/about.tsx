import React from "react";
import { Container, Box, Typography, Button, Grid, GlobalStyles, Rating, Paper, Avatar } from "@mui/material";
import { FaCheckCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { styled } from "@mui/system";
import Head from "next/head";
import Link from "next/link";

// Global styles to override the fixed white header for this page only
const CustomNavbarStyles = (
  <GlobalStyles
    styles={{
      "header": {
        background: "transparent !important",
        backgroundColor: "transparent !important",
        boxShadow: "none !important",
        position: "absolute !important",
        width: "100% !important",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // Subtle separator line matching the screenshot
      },
      "header a": {
        color: "#ffffff !important",
      },
      "header button": {
        color: "#ffffff !important",
      },
      // Target the language selector button specifically if needed
      "header .langButton": {
        color: "#ffffff !important",
      },
    }}
  />
);

const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(180deg, #003d7a 0%, #002142 100%)", // Gradient matching the screenshot depth
  color: "#ffffff",
  paddingTop: "180px", // Increased space for navbar and centering
  paddingBottom: "100px",
  textAlign: "center",
  width: "100%",
  position: "relative",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: "#333333", // Dark color for "The"
  marginBottom: "16px",
}));

const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#fd7e14", // Orange color
  color: "white",
  padding: "10px 24px",
  borderRadius: "24px",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#e36d0c",
  },
}));

const AboutUs = () => {
  return (
    <>
      {CustomNavbarStyles}
      <Head>
        <title>About Us - Desi Helpers</title>
      </Head>

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.9rem", color: "white" }}>
              Home &gt; About Us
            </Typography>
          </Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Connecting Communities, One Helper at a Time
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            We make finding trusted household help simple, fast, and free—while building a supportive community where people help people.
          </Typography>
        </Container>
      </HeroSection>

      {/* Main Content */}
      <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            {/* Left Text Content */}
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ fontWeight: 700, color: "#666", letterSpacing: 1 }}>
                WHY Desi Helpers
              </Typography>
              <SectionTitle variant="h4">
                The <span style={{ color: "#003366" }}>Problem We Are Solving</span>
              </SectionTitle>

              <Typography variant="body1" sx={{ color: "#555", mb: 3, lineHeight: 1.7 }}>
                The way people search for household help—nannies, chefs, tutors, and more—has changed drastically. Most rely on multiple social media groups, messaging apps, or word-of-mouth to post their needs or services.
              </Typography>

              <Typography variant="body1" sx={{ color: "#555", mb: 3, lineHeight: 1.7 }}>
                Our platform provides a one-stop, scalable solution for all helper needs:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <FaCheckCircle size={24} style={{ color: "#fd7e14", marginTop: "4px" }} />
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    <strong>Posters</strong> can view active profiles nearby and connect instantly—no posting or reposting required.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <FaCheckCircle size={24} style={{ color: "#fd7e14", marginTop: "4px" }} />
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    <strong>Seekers</strong> can see verified opportunities in their area—without endless group hopping.
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.7 }}>
                This means faster connections, less effort, and a better experience for everyone.
              </Typography>

              <OrangeButton variant="contained">
                Join the community
              </OrangeButton>
            </Grid>

            {/* Right Image */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/why-us-image-clear.png"
                alt="Construction workers discussion"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "48px", // Uniform large rounded corners matching the latest uploaded asset style
                  boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
                  mixBlendMode: "multiply",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: "#003366",
              mb: 3
            }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{
              color: "#666",
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6
            }}>
              Our mission is simple - to create value by assisting you in finding high quality leads for your household needs saving your time and frustration from other platforms and connections.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {/* Connect */}
            <Grid item xs={12} md={4}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}>
                <Box
                  component="img"
                  src="/assets/mission-connect-hq.png"
                  alt="Connect"
                  sx={{ height: "180px", mb: 2, mixBlendMode: "multiply" }}
                />
                <Typography variant="body2" sx={{ color: "#666", maxWidth: "300px" }}>
                  Connect and engage with potential social contacts on our platform
                </Typography>
              </Box>
            </Grid>

            {/* Care */}
            <Grid item xs={12} md={4}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}>
                <Box
                  component="img"
                  src="/assets/mission-care-hq.png"
                  alt="Care"
                  sx={{ height: "180px", mb: 2, mixBlendMode: "multiply" }}
                />
                <Typography variant="body2" sx={{ color: "#666", maxWidth: "300px" }}>
                  Find the nanny or household Care and support your need to elevate your lifestyle
                </Typography>
              </Box>
            </Grid>

            {/* Excel */}
            <Grid item xs={12} md={4}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}>
                <Box
                  component="img"
                  src="/assets/mission-excel-hq.png"
                  alt="Excel"
                  sx={{ height: "180px", mb: 2, mixBlendMode: "multiply" }}
                />
                <Typography variant="body2" sx={{ color: "#666", maxWidth: "300px" }}>
                  Foster the community culture and Excel together
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, backgroundColor: "#ffffff", overflow: "hidden" }}>
        <Container>
          <Grid container spacing={6}>
            {/* Left Content */}
            <Grid item xs={12} md={4} sx={{ position: "relative" }}>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <FaQuoteLeft size={100} color="#e0e8ff" style={{ opacity: 0.5, marginBottom: "20px" }} />
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  color: "#003366",
                  mb: 2,
                  lineHeight: 1.2
                }}>
                  What Our Members <br /> Have To Say
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                </Typography>
                <OrangeButton variant="contained">
                  Connect Us
                </OrangeButton>
              </Box>
            </Grid>

            {/* Right Content - Review Cards */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Column 1 */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TestimonialCard
                      name="Ravi Patel"
                      location="Fremont, California"
                      text="Got connected to someone local who did an amazing job. Kids were thrilled! Highly recommend DesiHelpers."
                      image="/assets/img_baker1.png"
                    />
                    <TestimonialCard
                      name="Neha Sharma"
                      location="Dallas, Texas"
                      text="As a new mom, I really needed a mother's helper for a few hours a day. I found a kind and reliable lady through DesiHelpers who made life so much easier. This site is a lifesaver for families."
                      image="/assets/img_nanny1.png"
                    />
                    <TestimonialCard
                      name="Arjun Reddy"
                      location="Seattle, Washington"
                      text="I recently moved here and was looking for weekend catering gigs. Signed up on DesiHelpers and got my first order for a small party in just a week. Great platform for side income!"
                      image="/assets/img_event_helper1.png"
                    />
                  </Box>
                </Grid>

                {/* Column 2 */}
                <Grid item xs={12} sm={6} sx={{ mt: { sm: 6 } }}> {/* Staggered effect */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TestimonialCard
                      name="Deepak Nair"
                      location="Boston, Massachusetts"
                      text="Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure."
                      image="/assets/img_caterer1.png"
                    />
                    <TestimonialCard
                      name="Pooja Joshi"
                      location="Houston, Texas"
                      text="I hired a catering team through DesiHelpers for my parents' anniversary. The food was authentic and homely, just like we wanted. All our guests kept asking where we found them!"
                      image="/assets/img_tutoring1.png"
                    />
                    <TestimonialCard
                      name="Kiran Malhotra"
                      location="San Jose, California"
                      text="I'm a baker and listed my services here. Within two weeks, I got three cake orders from families nearby. This platform really helps small business owners like me."
                      image="/assets/img_househelper1.png"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Ready to Get Started Section */}
      <Box sx={{
        py: 10,
        backgroundColor: "#fff5eb", // Light peach background
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Word Cloud Image */}
        <Box
          component="img"
          src="/assets/img_text_language_cloud.svg"
          alt="Background Pattern"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15, // Low opacity for background effect
            zIndex: 1
          }}
        />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                color: "#d35400", // Darker orange for the heading
                mb: 2
              }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" sx={{
                color: "#333",
                maxWidth: "600px",
                fontSize: "1.1rem",
                lineHeight: 1.6
              }}>
                Join our community today and experience the difference of working with verified, trusted professionals.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" }, mt: { xs: 4, md: 0 } }}>
              <OrangeButton variant="contained" sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                backgroundColor: "#e65100",
                "&:hover": { backgroundColor: "#cf4900" }
              }}>
                Join the community
              </OrangeButton>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

// Helper Component for Testimonial Card
const TestimonialCard = ({ name, location, text, image }: { name: string, location: string, text: string, image: string }) => (
  <Paper elevation={0} sx={{
    p: 3,
    borderRadius: "24px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0"
  }}>
    <Box sx={{ display: "flex", mb: 2 }}>
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} color="#ffc107" size={18} style={{ marginRight: "2px" }} />
      ))}
    </Box>
    <Typography variant="body2" sx={{ color: "#555", mb: 3, lineHeight: 1.6, minHeight: "60px" }}>
      "{text}"
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar src={image} alt={name} sx={{ width: 48, height: 48 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#333" }}>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#888", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", marginRight: "4px" }}>📍</span> {location}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default AboutUs;
