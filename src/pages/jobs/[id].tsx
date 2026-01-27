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

const ProfilePage = ({ profile, ogImageUrl, description }: { profile: IJobs, ogImageUrl:string , description:string}) => {
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
        <meta property="og:title" content={`${profile?.userProfile?.displayName }'s Post`} />
        <meta
          property="og:description"
          content={description}
        />
         <meta
          property="og:image"
          content={`${ogImageUrl}`|| dummyImage}
        />
        <meta property="og:url" content={`${base_url}jobs/${profile?.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className={`container-fluid mb-4 ${commonStyles.displayDetailsWrapper}`}
      >
      <CJobProfile profile={profile!}  />
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

  const fetchedUserData = await ApiService.crud(
    APIDetails.getJobById,
    id as string
  );
  const profile = fetchedUserData[1] as IJobs;
  const dummyImage = `https://avatar.iran.liara.run/username?username=${profile?.userProfile?.displayName}+`;
  const validBucketName = bucketName ?? ""; 
  const profilePhoto = profile?.userProfile?.profilePhoto ?? ""; 
  const ogImageUrl = profilePhoto ? getWorkPhotoUrls(validBucketName, [profilePhoto]) : dummyImage;
  const jobType = profile?.jobType?.name
  const location = `${profile?.city},${profile?.state},${profile?.zipCode}`
  const description = `Required: ${jobType} | Location: ${location}`;

  return {
    props: {
      profile,
      ogImageUrl,
      description
    },
  };
};

export default ProfilePage;

