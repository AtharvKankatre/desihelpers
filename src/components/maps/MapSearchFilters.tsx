import { useState } from "react";
import IMapSearchFilters from "@/models/MapFilters";
import { MapRadius } from "@/constants/EMapRadius";
import RadarSearch from "./RadarSearch";
import { ISubCategory } from "@/models/JobCategories";
import { useAuth } from "@/services/authorization/AuthContext";
import { Form } from "react-bootstrap";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { CMapSearchModal } from "./CMapSearchModal";
import styles from "@/styles/Map.module.css";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { FormikProps } from "formik";

type MapSearchFiltersProps = {
  className?: string;
  filters: FormikProps<IMapSearchFilters>;
};

const MapSearchFilters: React.FC<MapSearchFiltersProps> = ({ filters }) => {
  const { jobCategories } = useAuth();
  const { mobile, tablet } = useAppMediaQuery();

  const [load, setLoad] = useState<boolean>(true);

  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

  // Modal related params for Mobile and tablet
  const [showModal, setShowModal] = useState<boolean>(false);

  const changeAddressFn = (e: [number, number] | null) => {
    if (e != null) {
      filters.setFieldValue("coordinates", e, true);
    }
  };

  if (onload) return <div />;

  if (tablet || mobile) {
    return (
      <div className={styles.firstRowTablet}>
        <RadarSearch
          name="coordinates"
          className={`${styles.radarMapClassTablet}`}
          onSearch={(e) => changeAddressFn(e)}
        />
        <CMapSearchModal
          className={` ${styles.searchIconMapClassMobileAndTablet}`}
          showModal={showModal}
          filters={filters}
          toggleModal={(e) => setShowModal(e)}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.firstRow}`}>
      <div className={`row col-sm-12 mx-auto`}>
        <div className="col-md-4">
          <RadarSearch
            name="coordinates"
            onSearch={(e) => changeAddressFn(e)}
          />
        </div>
        <div className="col-md-2">
          <Form.Select
            className="mb-1"
            onChange={filters.handleChange}
            value={filters.values.role}
            name="role"
          >
            <option>Select a role</option>
            {Object.values(ViewTypesForMap).map((e) => (
              <option id={e} key={e}>
                {e}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-md-2">
          <Form.Select
            className="mb-1"
            value={filters.values.category}
            onChange={filters.handleChange}
            name="category"
          >
            <option>Select a category</option>
            {jobCategories.map((e) => (
              <option id={e.id ?? "-"} key={e.id ?? "-"}>
                {e.name ?? "-"}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className={`col-md-2`}>
          <Form.Select
            className="mb-1"
            value={filters.values.subCategory}
            onChange={filters.handleChange}
            name="subCategory"
          >
            <option>Select a sub-category</option>
            {filters.values.subCategories?.map((e, index) => (
              <option
                id={e.jobTypeId ?? "-"}
                key={`${e.jobTypeId ?? "-"} ${index}`}
              >
                {e.name ?? "-"}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Change radius */}
        <div className={`col-md-2`}>
          <Form.Select
            className="mb-1"
            value={`${filters.values.radius} miles`}
            onChange={(e) => {
              let n: number = parseInt(
                e.target.value.split(" ")[0].toString(),
                0
              );
              filters.setFieldValue("radius", n, true);
            }}
          >
            {Object.values(MapRadius).map((e) => (
              <option id={`${e}`} key={`${e}`}>
                {`${e} miles`}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
    </div>
  );
};

export default MapSearchFilters;
