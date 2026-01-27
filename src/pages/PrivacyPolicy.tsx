import { MainBG } from "@/components/page_related/landing/BackGround";
import styles from "@/styles/Footer.module.css";
import { Box, Typography } from "@mui/material";

const PrivacyPolicy: React.FC = () => {
  return (
    <MainBG className={`${styles.bgImagePrivacyPolicy}`}>
      <div className={`container-fluid `} style={{ paddingTop: "80px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8 bg-white p-4">
            <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
              Privacy Policy
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, textAlign: "center" }}>
              Last Updated : 10 October 2024
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Welcome to <b>DesiHelpers.com</b> owned by <b>Desi Wayz Inc.</b>{" "}
                At Desi Wayz, we value your privacy and are committed to
                protecting any personal information you share with us. This
                Privacy Policy outlines the types of information we collect, how
                we use and protect it, and your rights regarding your
                information.
              </Typography>
            </Box>

            {/* 1 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                1. Information We Collect
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                We collect information to improve our services and provide you
                with a better user experience. This may include:
                <br />
                <br />
                <b>Personal Information:</b> When you contact us, subscribe to
                our updates, or use our services, we may collect personal
                details like your name, provided address, email address,
                phone/whatsapp number, and company information. <br />
                <br />
                <b>Usage Information:</b> We automatically collect information
                related to your interactions with our website, including your IP
                address, browser type, pages visited, and time spent on our
                website. <br />
                <br />
                <b>Cookies and Tracking Technologies:</b> Our website uses
                cookies and similar technologies to enhance user experience,
                understand user interactions, and analyze traffic patterns. You
                can adjust your browser settings to reject cookies, but some
                features of our website may not function properly.
              </Typography>
            </Box>

            {/* 2 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                2. How We Use Your Information
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                The information we collect is used to:
                <br />
                <br />
                Provide, operate, and maintain our website.
                <br />
                <br />
                Improve, personalize, and expand our services.
                <br />
                <br />
                Communicate with you, including responding to inquiries and
                providing updates.
                <br />
                <br />
                Send promotional content, newsletters, or marketing information,
                if you have opted in to receive such communications.
                <br />
                <br />
                Monitor and analyze usage trends and activities in connection
                with our website.
                <br />
                <br />
              </Typography>
            </Box>

            {/* 3 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                3. Sharing Your Information
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                We do not sell or trade your personal information to third
                parties. However, we may share information in the following
                circumstances:
                <br />
                <br />
                <b>Service Providers:</b> We may share your information with
                trusted third-party vendors who assist us in operating our
                website and conducting our business, provided they comply with
                strict data privacy and security practices.
                <br />
                <br />
                <b>Legal Requirements: </b> We may disclose your information
                when required to comply with applicable laws or respond to valid
                legal requests. <br />
                <br />
                <b>Cookies and Tracking Technologies:</b> Our website uses
                cookies and similar technologies to enhance user experience,
                understand user interactions, and analyze traffic patterns. You
                can adjust your browser settings to reject cookies, but some
                features of our website may not function properly.
              </Typography>
            </Box>

            {/* 4 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                4. Data Security
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no data
                transmission over the internet can be guaranteed as completely
                secure, and we cannot ensure the absolute security of any
                information shared with us.
              </Typography>
            </Box>

            {/* 5 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                5. Retention of Information
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                We retain personal information for as long as necessary to
                fulfill the purposes for which it was collected, comply with
                legal obligations, and resolve disputes.
              </Typography>
            </Box>

            {/* 6*/}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                6. Your Rights
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                Depending on your location, you may have the following rights
                regarding your personal information:
                <br />
                <br />
                <b>Access: </b> Request access to the personal information we
                hold about you.
                <br />
                <br />
                <b>Correction: </b> Request correction of any inaccurate or
                incomplete information.
                <br />
                <br />
                <b>Deletion: </b> Request deletion of your personal
                information, subject to certain conditions.
                <br />
                <br />
                <b>Opt-out: </b> Opt out of marketing communications at any
                time by clicking the &ldquo;unsubscribe&rdquo; link in emails or contacting
                us directly.
                <br />
                <br />
              </Typography>
            </Box>

            {/* 7 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                7. Third-Party Links
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                Our website may contain links to third-party websites. This
                Privacy Policy does not apply to those websites, and we are not
                responsible for the privacy practices of third parties. We
                encourage you to review the privacy policies of each site you
                visit.
              </Typography>
            </Box>

            {/* 8 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                8. Children&quot;s Privacy
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                Our services are not directed towards individuals under the age
                of 18, and we do not knowingly collect personal information from
                children. If you believe a child has provided us with personal
                information, please contact us to have it removed.
              </Typography>
            </Box>

            {/* 9 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                9. Changes to This Privacy Policy
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any significant changes by posting the new Privacy Policy
                on this page with an updated &ldquo;Last Updated&rdquo; date.
              </Typography>
            </Box>

            {/* 10 */}
            <Box sx={{ mb: 4 }}>
              <Typography className={`${styles.bgPrivacyPolicyHeading}`}>
                10. Contact Us
              </Typography>
              <Typography className={`${styles.bgPrivacyPolicyText}`}>
                If you have questions or concerns about this Privacy Policy,
                please write to us using the <b>&ldquo;Contact Us&rdquo;</b> form.
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </MainBG>
  );
};
export default PrivacyPolicy;
