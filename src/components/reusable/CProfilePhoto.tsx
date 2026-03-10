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
      console.log("[CProfilePhoto] Init fetchPhotoUrl, profilePhoto prop is:", profilePhoto);
      if (!profilePhoto) {
        onPhotoUrlReady?.(undefined);
        return;
      }

      try {
        console.log("[CProfilePhoto] Calling getWorkPhotoUrls for:", profilePhoto);
        const urls = await getWorkPhotoUrls("", [profilePhoto]);
        console.log("[CProfilePhoto] getWorkPhotoUrls returned:", urls);
        const url = urls.length > 0 ? urls[0] : undefined;
        setPhotoUrl(url);
        onPhotoUrlReady?.(url);
      } catch (error) {
        console.error("[CProfilePhoto] Error fetching signed photo URL in CProfilePhoto:", error);
        onPhotoUrlReady?.(undefined);
      }
    };

    fetchPhotoUrl();
  }, [profilePhoto, onPhotoUrlReady]);

  console.log("[CProfilePhoto] Render photoUrl is currently:", photoUrl);

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
