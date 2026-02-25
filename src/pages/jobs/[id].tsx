import { GetServerSideProps } from "next";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import commonStyles from "@/styles/Common.module.css";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import { IJobs } from "@/models/Jobs";
import CJobProfile from "@/components/page_related/user_profile/CJobProfile";
import withAuth from "@/services/authorization/ProfileService";

interface Params extends ParsedUrlQuery {
  id: string;
}

const ProfilePage = ({ profile, ogImageUrl, description }: { profile: IJobs, ogImageUrl: string, description: string }) => {
  const base_url = process.env.NEXT_PUBLIC_Base_API_URL;
  const dummyImage = `https://avatar.iran.liara.run/username?username=${profile?.userProfile?.displayName}+`;


  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <meta property="fb:app_id" content={`${process.env.FACEBOOK_APP_ID}`}></meta>
        <link rel="canonical" href={`${base_url}jobs/${profile?.id}`} />
        <meta property="og:title" content={`${profile?.userProfile?.displayName}'s Post`} />
        <meta
          property="og:description"
          content={description}
        />
        <meta
          property="og:image"
          content={`${ogImageUrl}` || dummyImage}
        />
        <meta property="og:url" content={`${base_url}jobs/${profile?.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >
        <CJobProfile profile={profile!} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const bucketName: string | undefined = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
  if (!id) {
    return {
      notFound: true,
    };
  }

  // Always fetch from API
  const fetchedUserData = await ApiService.crud(
    APIDetails.getJobById,
    id as string
  );

  let profile: IJobs | undefined;
  if (fetchedUserData[0]) {
    profile = fetchedUserData[1] as IJobs;
  }

  if (!profile) {
    return {
      notFound: true,
    };
  }

  // const profile = fetchedUserData[1] as IJobs; // Old logic 
  const validBucketName = bucketName ?? "";
  const dummyImage = `https://avatar.iran.liara.run/username?username=${profile?.userProfile?.displayName}+`;
  const profilePhoto = profile?.userProfile?.profilePhoto ?? "";
  const photoUrls = profilePhoto ? await getWorkPhotoUrls(validBucketName, [profilePhoto]) : [];
  const ogImageUrl = photoUrls.length > 0 ? photoUrls[0] : dummyImage;
  const jobType = profile?.jobType?.name
  const location = `${profile?.city},${profile?.state},${profile?.zipCode}`
  const description = `Required: ${jobType} | Location: ${location}`;

  // Serialize dates recursively
  const serializedProfile = profile ? {
    ...profile,
    startDate: profile.startDate ? new Date(profile.startDate).toISOString() : undefined,
    createdAt: profile.createdAt ? new Date(profile.createdAt).toISOString() : undefined,
    updatedAt: profile.updatedAt ? new Date(profile.updatedAt).toISOString() : undefined,
    userProfile: profile.userProfile ? {
      ...profile.userProfile,
      createdAt: profile.userProfile.createdAt ? new Date(profile.userProfile.createdAt).toISOString() : undefined,
      updatedAt: profile.userProfile.updatedAt ? new Date(profile.userProfile.updatedAt).toISOString() : undefined,
    } : undefined
  } : null;

  return {
    props: {
      profile: JSON.parse(JSON.stringify(serializedProfile)) as unknown as IJobs, // brute force strict serialization check
      ogImageUrl,
      description
    },
  };
};

export default ProfilePage;
