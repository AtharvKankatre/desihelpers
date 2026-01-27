import { MapRadius } from "@/constants/EMapRadius";
import Roles from "@/constants/ERoles";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import IMapSearchFilters from "@/models/MapFilters";
import { useAuth } from "@/services/authorization/AuthContext";
import { FormikProps } from "formik";
import { FunctionComponent } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { VscSettings } from "react-icons/vsc";
import { number } from "yup";

type Props = {
  className?: string;
  showModal: boolean;
  filters: FormikProps<IMapSearchFilters>;
  toggleModal: (close: boolean) => void;
};

export const CMapSearchModal: FunctionComponent<Props> = ({ ...Props }) => {
  const { jobCategories } = useAuth();

  const applySearchFn = () => {
    Props.toggleModal(false);
  };

  return (
    <>
      <VscSettings
        className={`${Props.className ?? "col-md-1"}`}
        size={28}
        onClick={(e) => Props.toggleModal(true)}
      />

      <Modal
        show={Props.showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="ps-2">
            Advanced Search
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col">
            <div className="col-md-12">
              <Form.Select
                className="mb-3"
                onChange={Props.filters.handleChange}
                value={Props.filters.values.role}
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
            <div className="col-md-12">
              <Form.Select
                className="mb-3"
                value={Props.filters.values.category}
                onChange={Props.filters.handleChange}
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

            <div className={`col-md-12`}>
              <Form.Select
                className="mb-3"
                value={Props.filters.values.subCategory}
                onChange={Props.filters.handleChange}
                name="subCategory"
              >
                <option>Select a sub-category</option>
                {Props.filters.values.subCategories?.map((e, index) => (
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
            <div className={`col-md-12`}>
              <Form.Select
                className="mb-3"
                value={`${Props.filters.values.radius} miles`}
                onChange={(e) => {
                  let n: number = parseInt(
                    e.target.value.split(" ")[0].toString(),
                    0
                  );
                  Props.filters.setFieldValue("radius", n, true);
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-secondary"
            onClick={() => Props.toggleModal(false)}
          >
            Close
          </Button>
          <Button onClick={applySearchFn}>Apply Search</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
