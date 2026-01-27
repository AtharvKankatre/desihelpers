import { useEffect, useState } from "react";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

interface ProfilePhotoComponentProps {
  profilePhoto?: string;
  onPhotoUrlReady?: (url: string | undefined) => void; // Callback for parent component
}

const ProfilePhotoComponent = ({ profilePhoto, onPhotoUrlReady }: ProfilePhotoComponentProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (!profilePhoto) {
        onPhotoUrlReady?.(undefined);
        return;
      }

      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        console.error("S3 bucket name is not set in the environment variables.");
        return;
      }

      try {
        const urls = getWorkPhotoUrls(bucketName, [profilePhoto]); // Assuming getWorkPhotoUrls takes an array
        const url = urls.length > 0 ? urls[0] : undefined;
        setPhotoUrl(url);
        onPhotoUrlReady?.(url); // Notify parent of the resolved URL
      } catch (error) {
        console.error("Error fetching photo URL:", error);
        onPhotoUrlReady?.(undefined);
      }
    };

    fetchPhotoUrl();
  }, [profilePhoto, onPhotoUrlReady]);

  return (
    <div>
      {photoUrl ? (
        <img src={photoUrl} alt="Profile" className="profile-photo" />
      ) : (
        <p>No profile photo available</p>
      )}
    </div>
  );
};

export default ProfilePhotoComponent;
