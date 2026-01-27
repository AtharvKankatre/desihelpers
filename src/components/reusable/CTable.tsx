import { FunctionComponent } from "react";
import styles from "@/styles/UserProfiles.module.css";

type Props = {
  headDetails: string[];
  bodyDetails: any;
  tableClassName?: string;
};

export const CTable: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <div className={`table-responsive ${styles.viewProfileMain}`}>
      <table className={`${Props.tableClassName ?? "table table-hover"}`}>
        {/* Start of table */}

        {/* Define the table head */}
        <thead>
          <tr>
            {Props.headDetails.map((h) => (
              <th key={h} scope="col" className={`table-active text-center`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Define the table body */}
        <thead>{Props.bodyDetails}</thead>

        {/* End of table */}
      </table>
    </div>
  );
};
