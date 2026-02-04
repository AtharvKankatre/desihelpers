import React from "react";
import { Container, Box, Typography, GlobalStyles } from "@mui/material";
import { styled } from "@mui/system";
import Head from "next/head";

// Reuse the global styles for the transparent navbar from About Us
const CustomNavbarStyles = (
  <GlobalStyles
    styles={{
      "header": {
        background: "transparent !important",
        backgroundColor: "transparent !important",
        boxShadow: "none !important",
        position: "absolute !important",
        width: "100% !important",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      },
      "header a:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
        color: "#ffffff !important",
      },
      "header button:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
        color: "#ffffff !important",
      },
      "header .langButton": {
        color: "#ffffff !important",
      },
      // Force notification popup text to be visible
      ".notification-popup": {
        color: "#000000 !important",
      },
      ".notification-popup *": {
        color: "#000000 !important",
      },
      ".notification-popup .MuiTypography-root": {
        color: "#000000 !important",
      },
      ".notification-popup b": {
        color: "#000000 !important",
      },
      // Force language dropdown text to be visible
      ".language-dropdown": {
        color: "#000000 !important",
      },
      ".language-dropdown *": {
        color: "#000000 !important",
      },
      ".language-dropdown button": {
        color: "#000000 !important",
      },
    }}
  />
);

const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(180deg, #00132F 0%, #003E95 100%)",
  color: "#ffffff",
  paddingTop: "180px",
  paddingBottom: "80px",
  textAlign: "center",
  width: "100%",
  position: "relative",
}));

const ContentSection = styled(Box)(({ theme }) => ({
  paddingTop: "80px",
  paddingBottom: "80px",
  backgroundColor: "#ffffff",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: "#003366",
  marginBottom: "16px",
  marginTop: "32px",
}));

const PrivacyPolicy = () => {
  return (
    <>
      {CustomNavbarStyles}
      <Head>
        <title>Privacy Policy - Desi Helpers</title>
      </Head>

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.9rem", color: "white" }}>
              Home &gt; Privacy Policy
            </Typography>
          </Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Last Updated : 10 October 2024
          </Typography>
        </Container>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        <Container maxWidth="md">
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8, mb: 4 }}>
            Welcome to DesiHelpers.com owned by Desi Wayz Inc. At Desi Wayz, we value your privacy and are committed to protecting any personal information you share with us. This Privacy Policy outlines the types of information we collect, how we use and protect it, and your rights regarding your information.
          </Typography>

          <SectionTitle variant="h6">1. Information We Collect</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            We collect information to improve our services and provide you with a better user experience. This may include:
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Personal Information:</Box> When you contact us, subscribe to our updates, or use our services, we may collect personal details like your name, provided address, email address, phone/whatsapp number, and company information.
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Usage Information:</Box> We automatically collect information related to your interactions with our website, including your IP address, browser type, pages visited, and time spent on our website.
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Cookies and Tracking Technologies:</Box> Our website uses cookies and similar technologies to enhance user experience, understand user interactions, and analyze traffic patterns. You can adjust your browser settings to reject cookies, but some features of our website may not function properly.
          </Typography>

          <SectionTitle variant="h6">2. How We Use Your Information</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            The information we collect is used to:
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              Provide, operate, and maintain our website.
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              Improve, personalize, and expand our services.
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              Communicate with you, including responding to inquiries and providing updates.
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              Send promotional content, newsletters, or marketing information, if you have opted in to receive such communications.
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8 }}>
              Monitor and analyze usage trends and activities in connection with our website.
            </Typography>
          </Box>

          <SectionTitle variant="h6">3. Sharing Your Information</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            We do not sell or trade your personal information to third parties. However, we may share information in the following circumstances:
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Service Providers:</Box> We may share your information with trusted third-party vendors who assist us in operating our website and conducting our business, provided they comply with strict data privacy and security practices.
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Legal Requirements:</Box> We may disclose your information when required to comply with applicable laws or respond to valid legal requests.
          </Typography>

          <SectionTitle variant="h6">4. Data Security</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the internet can be guaranteed as completely secure, and we cannot ensure the absolute security of any information shared with us.
          </Typography>

          <SectionTitle variant="h6">5. Retention of Information</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            We retain personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, and resolve disputes.
          </Typography>

          <SectionTitle variant="h6">6. Your Rights</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            Depending on your location, you may have the following rights regarding your personal information:
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Access:</Box> Request access to the personal information we hold about you.
            </Typography>
            <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Correction:</Box> Request correction of any inaccurate or incomplete information.
            </Typography>
            <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Deletion:</Box> Request deletion of your personal information, subject to certain conditions.
            </Typography>
            <Typography variant="body1" component="div" sx={{ color: "#555", lineHeight: 1.8 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Opt-out:</Box> Opt out of marketing communications at any time by clicking the "unsubscribe" link in emails or contacting us directly.
            </Typography>
          </Box>

          <SectionTitle variant="h6">7. Third-Party Links</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites, and we are not responsible for the privacy practices of third parties. We encourage you to review the privacy policies of each site you visit.
          </Typography>

          <SectionTitle variant="h6">8. Children's Privacy</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            Our services are not directed towards individuals under the age of 18, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us to have it removed.
          </Typography>

          <SectionTitle variant="h6">9. Changes to This Privacy Policy</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on this page with an updated "Last Updated" date.
          </Typography>

          <SectionTitle variant="h6">10. Contact Us</SectionTitle>
          <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8 }}>
            If you have questions or concerns about this Privacy Policy, please write to us using the members <b>"Contact Us"</b> form.
          </Typography>
        </Container>
      </ContentSection>
    </>
  );
};

export default PrivacyPolicy;
