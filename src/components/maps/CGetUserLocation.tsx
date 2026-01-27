import React, { FunctionComponent, useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import RadarMap from "radar-sdk-js/dist/ui/RadarMap";
import { CH6Label } from "../reusable/labels/CH6Label";
import styles from "@/styles/Map.module.css";
import { CH5Label } from "../reusable/labels/CH5Label";

type Props = {
  zipcode: string;
  onLocationSelect?: (coordinates: { lng: number; lat: number }) => void;
  initialCoordinates?: [number, number]; //Where 0th index is longitude and 1st index is latitude
};

export const CGetUserLocation: FunctionComponent<Props> = ({
  zipcode,
  onLocationSelect,
  initialCoordinates,
}) => {
  const radarInitialized = useRef<boolean>(false);
  const mapRef = useRef<RadarMap | null>(null);
  const markerRef = useRef<any>(null);
  const prevCoordinatesRef = useRef<[number, number] | undefined>(
    initialCoordinates
  );

  useEffect(() => {
    // Initialize Radar SDK if not already initialized
    if (!radarInitialized.current) {
      Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
      radarInitialized.current = true;
    }

    // Initialize the Radar map if not already initialized
    if (typeof document !== "undefined" && mapRef.current === null) {
      const map = Radar.ui.map({
        container: "map",
      });

      // Store the map instance in the ref
      mapRef.current = map;

      // Add click event listener for choosing a location
      map.on("click", handleMapClick);

      // Fetch coordinates initially once the map is loaded
      map.once("load", fetchCoordinates);
    }

    // Cleanup function to remove map and event listeners on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Effect to fly to new coordinates when initialCoordinates changes
  useEffect(() => {
    if (
      initialCoordinates &&
      (prevCoordinatesRef.current?.[0] !== initialCoordinates[0] ||
        prevCoordinatesRef.current?.[1] !== initialCoordinates[1])
    ) {
      fetchCoordinates();
    }
    // Update the previous coordinates reference
    prevCoordinatesRef.current = initialCoordinates;
  }, [initialCoordinates]);

  // Fetch coordinates and fly to them on the map
  const fetchCoordinates = async () => {
    try {
      if (initialCoordinates && mapRef.current) {
        // Fly to the initial coordinates if provided
        mapRef.current.flyTo({
          center: initialCoordinates,
          zoom: 9,
        });
        addMarker({
          lng: initialCoordinates[0],
          lat: initialCoordinates[1],
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates for zipcode:", error);
    }
  };

  // Handle map click event
  const handleMapClick = (e: any) => {
    const { lng, lat } = e.lngLat;
    addMarker({ lng, lat });
  };

  // Add marker at the specified coordinates
  const addMarker = (coordinates: { lng: number; lat: number }) => {
    // Remove any existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create a new marker at the specified location
    const marker = Radar.ui
      .marker()
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(mapRef.current!);
    markerRef.current = marker;

    // Fit the map to the marker
    mapRef.current?.fitToMarkers({ maxZoom: 10, padding: 80 });

    // Notify parent component with the selected coordinates
    if (onLocationSelect) {
      onLocationSelect(coordinates);
    }
  };

  return (
    <>
      <CH5Label label={`Current location`} />
      <div id="map" className={styles.mapSelectYourLocation} />
      <CH6Label
        className="mt-2"
        label="Select your location as this will help us to show you the jobs / job seekers around you. Your exact location will never be shared"
      />
    </>
  );
};
