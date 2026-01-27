class CoordinateService {
  // fetchCoordinates = async (zipCode: string) => {
  //   try {
  //     console.log("fetching coordinates...");

  //     const apiUrl = `${
  //       process.env.NEXT_PUBLIC_GEOCODE_BASE_URL
  //     }?query=${encodeURIComponent(zipCode)}&layers=postalCode&country=US`;
  //     const response = await fetch(apiUrl, {
  //       headers: {
  //         Authorization: `${process.env.NEXT_PUBLIC_RADAR_API_KEY}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     const { addresses } = data;
  //     console.log("Fetched coordinates:", addresses);

  //     if (addresses.length > 0) {
  //       const { latitude, longitude } = addresses[0];
  //       const adjustedCoordinates = this.getRandomCoordinatesWithinRadius(
  //         latitude,
  //         longitude,
  //         0.5
  //       );
  //       console.log("Adjusted Coordinates:", adjustedCoordinates);
  //       return adjustedCoordinates;
  //     } else {
  //       throw new Error("No address found.");
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     throw new Error(error);
  //   }
  // };

  public getRandomCoordinatesWithinRadius = (
    list: [number, number],
    radiusInMiles: number
  ): [number, number] => {
    const earthRadiusInMiles = 3960;
    const radiusInRadians = radiusInMiles / earthRadiusInMiles;

    const u = Math.random();
    const v = Math.random();

    const w = radiusInRadians * Math.sqrt(u);
    const t = 2 * Math.PI * v;

    const deltaLat = w * Math.cos(t);
    const deltaLng = (w * Math.sin(t)) / Math.cos(list[1] * (Math.PI / 180));

    const newLatitude = list[1] + deltaLat * (180 / Math.PI);
    const newLongitude = list[0] + deltaLng * (180 / Math.PI);

    return [newLongitude, newLatitude];
  };
}

export default CoordinateService;
