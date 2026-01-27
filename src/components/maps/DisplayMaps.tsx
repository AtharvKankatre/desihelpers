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

const DisplayMap: React.FC<Props> = ({
  onProfileClick,
  onJobClick,
  ...Props
}) => {
  const radarInitialized = useRef<boolean>(false);
  const mapRef = useRef<RadarMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const redrawBoundarys = () => {
    if (mapRef.current && Props.filters.coordinates) {
      // Remove the boundary layer and source if they exist
      if (mapRef.current.getSource("boundary")) {
        mapRef.current.removeLayer("boundary-line");
        mapRef.current.removeSource("boundary");
      }

      // Clear all existing markers
      removeMarkers();

      drawMap(mapRef.current);
    }
  };
  const bufferedLayerData = () => {
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
          const markerPoint = turf.point([
            markerData.location?.coordinates![0]!,
            markerData.location?.coordinates![1]!,
          ]);
          element.onclick = () => onJobClick(markerData);
          if (turf.booleanPointInPolygon(markerPoint, buffered)) {
            const marker = Radar.ui
              .marker({
                url: "/assets/maps/icon_map_locator.svg",
                popup: {
                  element: element,
                  className: `${mapStyles.radarPinCard}`,
                },
                width: "30px",
                height: "30px",
              })
              .setLngLat([
                markerData.location?.coordinates![0]!,
                markerData.location?.coordinates![1]!,
              ])
              .addTo(mapRef.current!);
            mapMarkers.push(marker);
          }
        });
      } else {
        Props.seekers.forEach((seeker) => {
          const element = document
            .getElementById(seeker.userId ?? "-")
            ?.cloneNode(true) as HTMLElement;
          element.style.visibility = "visible";
          element.id = seeker.id ?? "-";
          const markerPoint = turf.point([
            seeker.location?.coordinates![0]!,
            seeker.location?.coordinates![1]!,
          ]);
          element.onclick = () => onProfileClick(seeker);
          if (turf.booleanPointInPolygon(markerPoint, buffered)) {
            const marker = Radar.ui
              .marker({
                url: "/assets/maps/icon_map_locator.svg",
                popup: {
                  element: element,
                  className: `${mapStyles.radarPinCard}`,
                },
                width: "30px",
                height: "30px",
              })
              .setLngLat([
                seeker.location?.coordinates![0]!,
                seeker.location?.coordinates![1]!,
              ])
              .addTo(mapRef.current!);
            mapMarkers.push(marker);
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
      // Create a new instance of a radar map
      const map = Radar.ui.map({
        container: "map",
        style: "radar-default-v1",
        center: [Props.filters.coordinates[1], Props.filters.coordinates[0]],
        zoom: 8,
      });
      mapRef.current = map;

      mapRef.current.once("load", () => {
        bufferedLayerData();
        mapRef.current!.flyTo({
          center: [Props.filters.coordinates[1], Props.filters.coordinates[0]],
          zoom:
            Props.filters.radius == 50
              ? 9
              : Props.filters.radius == 25
              ? 10
              : 11,
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
    if (mapRef.current) {
      //Clear all existing markers
      removeMarkers();

      // Fly to the location
      mapRef.current.flyTo({
        center: [Props.filters.coordinates[1], Props.filters.coordinates[0]],
        zoom:
          Props.filters.radius == 50 ? 8 : Props.filters.radius == 25 ? 9 : 10,
      });
      const marker = Radar.ui
        .marker({
          popup: { html: "<h6>You are here</h6>" },
          width: "30px",
          height: "30px",
        })
        .setLngLat([Props.filters.coordinates[1], Props.filters.coordinates[0]])
        .addTo(mapRef.current!);
      mapMarkers.push(marker);

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
    <div id="map" className={`${mapStyles.mapOutline}`}>
      {Props.filters.role == ViewTypesForMap.viewJobs
        ? Props.jobs.map((e) => (
            <div id={e.id} key={e.id} style={{ visibility: "hidden" }}>
              <CPosterPin
                key={e.id}
                job={e}
                setModal={false}
                toggleModal={() => {}}
              />
            </div>
          ))
        : Props.seekers.map((e, ind) => (
            <div
              id={e.userId}
              key={`${e}${ind}`}
              style={{ visibility: "hidden" }}
            >
              <CSeekerPin seeker={e} setModal={false} toggleModal={() => {}} />
            </div>
          ))}
    </div>
  );
};

export default DisplayMap;
