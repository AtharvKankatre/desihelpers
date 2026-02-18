import { FunctionComponent, useState, useEffect } from "react";
import styles from "@/styles/Forms.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { CErrorString } from "./CError";

type Props = {
  className?: string;
  title?: string;
  formik: any;
  name: string;
  value: any;
  readonly?: boolean;
  error?: string;
};

export const CCheckBox: FunctionComponent<Props> = ({
  className,
  title,
  formik,
  name,
  value,
  readonly,
  error,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(value || true);
  const { mobile } = useAppMediaQuery();

  useEffect(() => {
    setIsChecked(value || true);
  }, [value]);

  const onChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    formik.setFieldValue(name, newCheckedState);
  };

  return (
    <div
      className={`${
        mobile ? "col-md-12" : className ?? "col-md-2"
      } align-self-end ${mobile ? "mt-3" : "mt-0"}`}
    >
      <InputGroup className="">
        <InputGroup.Checkbox
          type="checkbox"
          aria-label="Checkbox for following text input"
          checked={isChecked}
          onChange={onChange}
          disabled={readonly}
        />
        <Form.Control value={title} readOnly />
      </InputGroup>
      <CErrorString
        error={error}
        className={styles.errorMessageWithExtraHeight}
      />
    </div>
  );
};
