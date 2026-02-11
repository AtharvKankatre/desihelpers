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

  // Sample data matching ViewAllJobs.tsx for fallback/consistency
  const sampleJobs: IJobs[] = [
    { _id: "s1", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-10-20"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "kaka" } as any, aboutRequirement: "Looking for a mother's helper to assist with daily chores and childcare." },
    { _id: "s2", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Issaquah", state: "Washington", distance: 1.5, userProfile: { displayName: "Neha" } as any, aboutRequirement: "Seeking a full-time nanny for our 2 children." },
    { _id: "s3", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "Anil & Ridhika" } as any, aboutRequirement: "Need help with garden maintenance." },
    { _id: "s4", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 1.2, userProfile: { displayName: "Julia Martinez" } as any },
    { _id: "s5", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Los Angeles", state: "California", distance: 2.2, userProfile: { displayName: "Jose Ramirez" } as any },
    { _id: "s6", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.1, userProfile: { displayName: "Sarah Johnson" } as any },
    { _id: "s7", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 1.8, userProfile: { displayName: "kaka" } as any },
    { _id: "s8", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Oakland", state: "California", distance: 1.5, userProfile: { displayName: "Mark & Lisa" } as any },
    { _id: "s9", jobType: { name: "House Cleaner" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "Julia Martinez" } as any },
    { _id: "s10", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-10-21"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "Sarah Johnson" } as any },
    { _id: "s11", jobType: { name: "Gardener" } as any, workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Denver", state: "Colorado", distance: 2.5, userProfile: { displayName: "kaka" } as any },
    { _id: "s12", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 2.5, userProfile: { displayName: "Jose Ramirez" } as any },
    { _id: "s13", jobType: { name: "House Cleaner" } as any, workType: "Part Time", startDate: new Date("2025-10-12"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "kaka" } as any },
    { _id: "s14", jobType: { name: "Elder Caregiver" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "New York", state: "New York", distance: 1.5, userProfile: { displayName: "Megan Lee" } as any },
    { _id: "s15", jobType: { name: "Nanny" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "kaka" } as any },
    { _id: "s16", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 2.3, userProfile: { displayName: "Mark & Lisa" } as any },
    { _id: "s17", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Miami", state: "Florida", distance: 1.1, userProfile: { displayName: "Sarah Johnson" } as any },
  ];

  // Check if ID matches a sample job first
  let profile: IJobs | undefined = sampleJobs.find(j => j._id === id || j.id === id);

  if (!profile) {
    // If not sample, try fetching from API
    const fetchedUserData = await ApiService.crud(
      APIDetails.getJobById,
      id as string
    );
    profile = fetchedUserData[1] as IJobs;
  }

  // const profile = fetchedUserData[1] as IJobs; // Old logic 
  const validBucketName = bucketName ?? "";
  const dummyImage = `https://avatar.iran.liara.run/username?username=${profile?.userProfile?.displayName}+`;
  const profilePhoto = profile?.userProfile?.profilePhoto ?? "";
  const ogImageUrl = profilePhoto ? getWorkPhotoUrls(validBucketName, [profilePhoto]) : dummyImage;
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
