import { FunctionComponent } from "react";
import { CH5Label } from "./labels/CH5Label";
import { BiExpandVertical } from "react-icons/bi";

type Props = {
  title: string;
  children: any;
  isExpanded?: string; //Value can be "show" | "hide"
  id: string;
  className?:string;
};

export const CExpandablePanel: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <>
      {/* The header. On click of this component, the button one expands / collapses */}
      <>
        <a
          data-bs-toggle="collapse"
          href={`#${Props.id}`}
          role="button"
          aria-expanded="true"
          aria-controls={Props.id}
          className="text-decoration-none mt-4 d-flex align-items-center justify-content-between"
          style={{ color: "inherit" }} // Ensures link color is inherited
        >
          <CH5Label
            label={Props.title}
            className= {`${Props.className ?? "mb-0"}`} // Removes bottom margin from label
          />
          <BiExpandVertical size={18} />
        </a>
        <hr className="col-md-12 mt-2" />
      </>

      {/* The expandable panel */}
      <div className={`collapse ${Props.isExpanded ?? "hide"}`} id={Props.id}>
        {Props.children}
      </div>
    </>
  );
};
