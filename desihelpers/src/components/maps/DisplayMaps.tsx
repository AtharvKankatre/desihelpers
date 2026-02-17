import React, { useEffect, useRef, useState } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";
import RadarMap from "radar-sdk-js/dist/ui/RadarMap";
import IMapSearchFilters from "@/models/MapFilters";
import { IJobs } from "@/models/Jobs";
import mapStyles from "@/styles/Map.module.css";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { CSeekerPin } from "./CSeekerPin";
import { CPosterPin } from "./CPosterPin";

type Props = {
  filters: IMapSearchFilters;
  jobs: IJobs[];
  seekers: IUserProfileModel[];
  onProfileClick: (profile: IUserProfileModel) => void;
  onJobClick: (job: IJobs) => void;
};

let mapMarkers: any[] = [];

const removeMarkers = () => {
  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = []; // Clear the stored references
};

const DisplayMap: React.FC<Props & { onLocationSelect?: (lat: number, lng: number, address: string) => void }> = ({
  onProfileClick,
  onJobClick,
  onLocationSelect,
  ...Props
}) => {
  const radarInitialized = useRef<boolean>(false);
  const mapRef = useRef<RadarMap | null>(null);
  const markerRef = useRef<any>(null); // Store the main location marker
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleReverseGeocode = (lat: number, lng: number) => {
    setIsLoading(true);
    Radar.reverseGeocode({ latitude: lat, longitude: lng })
      .then((result: any) => {
        setIsLoading(false);
        if (result && result.addresses && result.addresses.length > 0) {
          const address = result.addresses[0].formattedAddress;
          if (onLocationSelect) {
            onLocationSelect(lat, lng, address);
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error("Reverse geocode error:", err);
        setError("Failed to get address.");
      });
  };

  const redrawBoundarys = () => {
    if (mapRef.current && Props.filters.coordinates) {
      // Remove the boundary layer and source if they exist
      if (mapRef.current.getSource("boundary")) {
        mapRef.current.removeLayer("boundary-line");
        mapRef.current.removeSource("boundary");
      }

      // Clear all existing markers except the main one if we handle it separately, 
      // but here we redraw everything so remove all.
      removeMarkers();

      // Clear main marker reference if it was in mapMarkers
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      drawMap(mapRef.current);
    }
  };
  const bufferedLayerData = () => {
    if (
      !Props.filters.coordinates ||
      typeof Props.filters.coordinates[0] !== "number" ||
      typeof Props.filters.coordinates[1] !== "number"
    ) {
      return;
    }

    const point = turf.point([
      Props.filters.coordinates[1],
      Props.filters.coordinates[0],
    ]);
    const buffered = turf.circle(point, Props.filters.radius, {
      units: "miles",
    });
    if (buffered) {
      // Check if the source and layer already exist, and remove them if they do
      if (mapRef.current?.getSource("boundary")) {
        mapRef.current.removeLayer("boundary-line");
        mapRef.current.removeSource("boundary");
      }
      // Add the new source and layer for the boundary
      mapRef.current!.addSource("boundary", {
        type: "geojson",
        data: buffered,
      });
      mapRef.current!.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": "#FF0000",
          "line-width": 2,
        },
      });
      // Add markers to the map based on the role
      if (Props.filters.role == ViewTypesForMap.viewJobs) {
        Props.jobs.forEach((markerData) => {
          const element = document
            .getElementById(markerData.id ?? "-")
            ?.cloneNode(true) as HTMLElement;
          element.style.visibility = "visible";
          element.id = markerData.id ?? "-";
          // Ensure coordinates exist
          if (markerData.location?.coordinates && markerData.location.coordinates.length >= 2) {
            const markerPoint = turf.point([
              markerData.location.coordinates[0],
              markerData.location.coordinates[1],
            ]);
            element.onclick = () => onJobClick(markerData);
            if (turf.booleanPointInPolygon(markerPoint, buffered)) {
              const marker = Radar.ui
                .marker({
                  url: "/assets/maps/icon_dh_pin.svg",
                  popup: {
                    element: element,
                    className: `${mapStyles.radarPinCard}`,
                  },
                  width: "30px",
                  height: "38px",
                })
                .setLngLat([
                  markerData.location.coordinates[0],
                  markerData.location.coordinates[1],
                ])
                .addTo(mapRef.current!);
              mapMarkers.push(marker);
            }
          }
        });
      } else {
        Props.seekers.forEach((seeker) => {
          const element = document
            .getElementById(seeker.userId ?? "-")
            ?.cloneNode(true) as HTMLElement;
          element.style.visibility = "visible";
          element.id = seeker.id ?? "-";
          if (seeker.location?.coordinates && seeker.location.coordinates.length >= 2) {
            const markerPoint = turf.point([
              seeker.location.coordinates[0],
              seeker.location.coordinates[1],
            ]);
            element.onclick = () => onProfileClick(seeker);
            if (turf.booleanPointInPolygon(markerPoint, buffered)) {
              const marker = Radar.ui
                .marker({
                  url: "/assets/maps/icon_dh_pin.svg",
                  popup: {
                    element: element,
                    className: `${mapStyles.radarPinCard}`,
                  },
                  width: "30px",
                  height: "38px",
                })
                .setLngLat([
                  seeker.location.coordinates[0],
                  seeker.location.coordinates[1],
                ])
                .addTo(mapRef.current!);
              mapMarkers.push(marker);
            }
          }
        });
      }
    }
  };
  // This is the first function that is called when the page is initialized
  useEffect(() => {
    // If radar is not initialized,  then initialize it
    if (!radarInitialized.current && mapRef.current === null) {
      Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
      radarInitialized.current = true;
    }

    if (typeof document !== "undefined" && mapRef.current === null) {
      const center: [number, number] =
        Props.filters.coordinates &&
          typeof Props.filters.coordinates[0] === "number" &&
          typeof Props.filters.coordinates[1] === "number"
          ? [Props.filters.coordinates[1], Props.filters.coordinates[0]]
          : [
            parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || "-122.121512"),
            parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || "47.673988")
          ];

      // Create a new instance of a radar map
      const map = Radar.ui.map({
        container: "map",
        style: "radar-default-v1",
        center: center,
        zoom: 8,
      });
      mapRef.current = map;

      mapRef.current.once("load", () => {
        setIsLoading(false);
        bufferedLayerData();
        if (
          Props.filters.coordinates &&
          typeof Props.filters.coordinates[0] === "number" &&
          typeof Props.filters.coordinates[1] === "number"
        ) {
          mapRef.current!.flyTo({
            center: [Props.filters.coordinates[1], Props.filters.coordinates[0]],
            zoom:
              Props.filters.radius == 50
                ? 9
                : Props.filters.radius == 25
                  ? 10
                  : 11,
          });
        }

        // Add click listener to map for moving the pin
        mapRef.current?.on('click', (e: any) => {
          const { lng, lat } = e.lngLat;
          // Move marker logic
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          }
          handleReverseGeocode(lat, lng);
        });

      });
    }
    drawMap(mapRef.current!);
  }, [
    Props.filters.coordinates,
    Props.filters.radius,
    Props.jobs,
    Props.seekers,
  ]);

  //coordinates: [number, number] | null
  const drawMap = (mapReference: RadarMap) => {
    if (
      mapRef.current &&
      Props.filters.coordinates &&
      typeof Props.filters.coordinates[0] === "number" &&
      typeof Props.filters.coordinates[1] === "number"
    ) {
      //Clear all existing markers
      removeMarkers();

      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Fly to the location
      mapRef.current.flyTo({
        center: [Props.filters.coordinates[1], Props.filters.coordinates[0]],
        zoom:
          Props.filters.radius == 50 ? 8 : Props.filters.radius == 25 ? 9 : 10,
      });

      // Main Location Marker
      const el = document.createElement('div');
      el.id = 'draggable-dh-marker';
      el.style.backgroundImage = 'url(/assets/maps/icon_dh_pin.svg)';
      el.style.width = '60px';
      el.style.height = '76px';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.cursor = 'grab';

      const marker = new maplibregl.Marker({
        element: el,
        draggable: true,
        anchor: 'bottom'
      })
        .setLngLat([Props.filters.coordinates[1], Props.filters.coordinates[0]])
        .addTo(mapRef.current!);

      markerRef.current = marker;

      // Add dragend listener
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        handleReverseGeocode(lngLat.lat, lngLat.lng);
      });

      if (mapRef.current!.getSource("boundary")) {
        mapRef.current!.removeLayer("boundary-line");
        mapRef.current!.removeSource("boundary");
      }
      mapRef.current.once("styledata", () => {
        bufferedLayerData();
      });
    }
  };
  return (
    <div id="map" className={`${mapStyles.mapOutline}`} style={{ position: 'relative' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: '#001838',
          fontWeight: 'bold'
        }}>
          Loading Map...
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '8px 16px',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {Props.filters.role == ViewTypesForMap.viewJobs
        ? Props.jobs.map((e) => (
          <div id={e.id} key={e.id} style={{ visibility: "hidden" }}>
            <CPosterPin
              key={e.id}
              job={e}
              setModal={false}
              toggleModal={() => { }}
            />
          </div>
        ))
        : Props.seekers.map((e, ind) => (
          <div
            id={e.userId}
            key={`${e}${ind}`}
            style={{ visibility: "hidden" }}
          >
            <CSeekerPin seeker={e} setModal={false} toggleModal={() => { }} />
          </div>
        ))}
    </div>
  );
};

export default DisplayMap;
