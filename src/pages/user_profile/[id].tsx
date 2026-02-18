import { GetServerSideProps } from "next";
import { IUserProfileModel } from "@/models/UserProfileModel";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import commonStyles from "@/styles/Common.module.css";
import Head from "next/head";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import CUserProfileCard from "@/components/page_related/user_profile/CUserProfileCard";
import withAuth from "@/services/authorization/ProfileService";


const ProfilePage = ({ profile, ogImageUrl,displayName ,description}: { profile: IUserProfileModel , ogImageUrl : string, displayName : string, description: string}) => {
  const base_url = process.env.NEXT_PUBLIC_Base_API_URL;
  const dummyImage = `https://avatar.iran.liara.run/username?username=${displayName}+`;

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
  {/* <title>{`${displayName || "Loading"}'s Profile`}</title> */}
  <meta property="fb:app_id" content={`${process.env.FACEBOOK_APP_ID}`} />
  {/* <meta
    name="description"
    content={des || "View the user's profile details."}
  /> */}
  <meta property="og:title" content={`${displayName}'s Profile`} />
  <meta
    property="og:description"
    content={description || ""}
  />
  <meta
    property="og:image"
    content={`${ogImageUrl}` || dummyImage}
  />
  <meta property="og:url" content={`${base_url}user_profile/${profile?._id}`} />
  <meta name="twitter:card" content="summary_large_image" />
</Head>


      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >

      <CUserProfileCard profile={profile!}  />     
       </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const bucketName: string | undefined = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;

  if (!id) {
    return {
      notFound: true,
    };
  }

  // Proceed to fetch the user data
  const fetchedUserData = await ApiService.crud(APIDetails.ShareProfileSeeker, id);
  const profile = fetchedUserData[1] as IUserProfileModel;
  const dummyImage = `https://avatar.iran.liara.run/username?username=${profile?.displayName}+`;
  const validBucketName = bucketName ?? ""; 
  const profilePhoto = profile?.profilePhoto ?? ""; 
  const ogImageUrl = profilePhoto ? getWorkPhotoUrls(validBucketName, [profilePhoto]) : dummyImage;
  const displayName = profile?.displayName ?? "";
  const servicesProvided = (profile?.jobDetails ?? [])
    .map((job) => job.jobType)
    .filter((type): type is string => !!type)
    .join(', ');

  const location = [profile?.city, profile?.state, profile?.zipCode]
    .filter((value): value is string => !!value)
    .join(', ');

  const description = `Services Provided: ${servicesProvided} | Location: ${location}`;

  return {
    props: {
      profile,
      ogImageUrl, 
      displayName,
      description,
    }
  };
};

export default ProfilePage;

