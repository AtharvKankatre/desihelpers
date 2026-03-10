export const getProxyUrl = (url: string): string => {
  if (!url || typeof url !== 'string' || !url.includes('.amazonaws.com/')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';
  return `${baseUrl}user-profile/proxy-image?url=${encodeURIComponent(url)}`;
};

export const getWorkPhotoUrls = async (bucketName: string, workPhotos: string[]): Promise<string[]> => {
  console.log("[s3Helper] getWorkPhotoUrls called with:", { bucketName, workPhotos });
  if (!workPhotos || workPhotos.length === 0) {
    console.log("[s3Helper] No workPhotos provided, returning empty array.");
    return [];
  }

  // OPTION: Redirect to Proxy instead of Signer for immediate fix
  return workPhotos.map(url => getProxyUrl(url));

  /* 
  // Commenting out the signer as it relies on IAM GetObject permissions which are currently blocked
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'}user-profile/signed-urls`;
    console.log("[s3Helper] Calling backend API:", apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: workPhotos })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("[s3Helper] Backend returned successfully:", data);
      return data.urls || [];
    }

    console.error("[s3Helper] Backend returned error status:", response.status, response.statusText);
    return workPhotos;
  } catch (err) {
    console.error('[s3Helper] Error fetching signed URLs from backend:', err);
    return workPhotos;
  }
  */
};

