import DropdownType from "@/types/DropdownType";
import { FunctionComponent, ReactEventHandler, useState } from "react";
import { DropdownButton, DropdownItem } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

type Props = {
  title: string;
  list: Array<DropdownType>;
  returnValue: (e: string) => void;
};

const CDropdown: FunctionComponent<Props> = ({ title, list, returnValue }) => {
  const { t } = useTranslation("common");

  const onSelect = (e: any) => {
    returnValue(e.target.value);
  };

  return (
    <select
      className="form-select"
      onChange={(e) => onSelect(e)}
      style={{ width: "max-content" }}
    >
      {list.map((item) => (
        <option value={item.id} key={item.id}>
          {t(item.value)}
        </option>
      ))}
    </select>
  );
};

export default CDropdown;
