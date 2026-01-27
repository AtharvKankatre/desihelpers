import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
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
  value?: any;
};

export const CDateTimePicker: FunctionComponent<Props> = ({ ...Props }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>();

  const onDateChange = (e: Dayjs | null) => {
    setStartDate(e);
    let val: string = Props.formikValue;
    if (e != null) {
      Props.formik.setFieldValue("startDate", e.toISOString(), true);
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
        <DateTimePicker
          slotProps={{
            textField: { size: "small", label: "" },
            field: { readOnly: true },
          }}
          // defaultValue={dayjs(new Date(Props.value.startDate * 1000))}
          disablePast={true}
          sx={{ width: "100%" }}
          label="Select Date"
          value={
            Props.value != undefined ? dayjs(new Date(Props.value)) : undefined
          }
          className={styles.datePickWrapper}
          onChange={(newDate) => onDateChange(newDate)}
          readOnly={Props.readonly}
        />
        <CErrorString error={Props.error} />
      </div>
    </LocalizationProvider>
  );
};
