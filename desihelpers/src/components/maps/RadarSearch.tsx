import React, { useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
interface MapSearchProps {
  onSearch: (coordinates: [number, number] | null) => void;
  className?: string;
  formik?: any;
  name?: string;
}

const RadarSearch: React.FC<MapSearchProps> = ({ ...Props }) => {
  const radarInitialized = useRef<boolean>(false);
  const autocompleteRef = useRef<any | null>(null);

  useEffect(() => {
    if (!radarInitialized.current) {
      Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
      radarInitialized.current = true;
    }

    autocompleteRef.current = Radar.ui.autocomplete({
      container: "address-input",
      placeholder: "Search & select address",
      onSelection: (address) => {
        if (address != null) {
          const { latitude, longitude } = address;
          const coordinates: [number, number] = [latitude, longitude];
          Props.onSearch(coordinates);
        }
      },
    });
    return () => {
      autocompleteRef.current?.remove();
    };
  }, []);

  return <div className={Props.className} id="address-input"></div>;
};

export default RadarSearch;
