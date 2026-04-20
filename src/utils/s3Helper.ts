export const getProxyUrl = (url: string): string => {
  if (!url || typeof url !== 'string' || !url.includes('.amazonaws.com/')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';
  return `${baseUrl}user-profile/proxy-image?url=${encodeURIComponent(url)}`;
};

export const getWorkPhotoUrls = async (bucketName: string, workPhotos: string[]): Promise<string[]> => {
  if (!workPhotos || workPhotos.length === 0) {
    return [];
  }

  // Try signed URLs first (expire in 1 hour, generated fresh each page load)
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'}user-profile/signed-urls`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: workPhotos })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        return data.urls;
      }
    }
  } catch (err) {
    console.warn('[s3Helper] Signed URL fetch failed, falling back to proxy:', err);
  }

  // Fallback: use proxy endpoint
  return workPhotos.map(url => getProxyUrl(url));
};

