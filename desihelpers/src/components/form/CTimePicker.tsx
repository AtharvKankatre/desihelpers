import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { FunctionComponent, useState } from "react";
import styles from "@/styles/Forms.module.css";
import { CErrorString } from "@/components/form/CError";
import { CH5Label } from "../reusable/labels/CH5Label";

type Props = {
  formik: any;
  error: any;
  title: string;
  className?: string;
  formikValue: string;
  readonly: boolean;
  isMandatory?: boolean;
};

export const CTimePicker: FunctionComponent<Props> = ({ ...Props }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const onDateChange = (e: Dayjs | null) => {
    setStartDate(e);
    if (e != null) {
      Props.formik.setFieldValue(Props.formikValue, e.toISOString(), true);
    }

  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`${Props.className} text-start`}>
        <div className="d-flex flex-row">
          <CH5Label label={Props.title} />
          {Props.isMandatory ? (
            <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>
          ) : null}
        </div>
        <TimePicker
          slotProps={{ textField: { size: "small", label: "" } }}
          sx={{ width: "100%" }}
          label="Select Time"
          value={startDate}
          className={styles.datePickWrapper}
          onChange={(time) => onDateChange(time)}
          readOnly={Props.readonly}
        />
        <CErrorString error={Props.error} />
      </div>
    </LocalizationProvider>
  );
};
