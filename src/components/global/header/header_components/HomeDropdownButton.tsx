import { FunctionComponent, useEffect, useState } from "react";
import styles from "@/styles/Common.module.css";
import { useRouter } from "next/router";
import { Routes } from "@/services/routes/Routes";
import JobServices from "@/services/jobs/JobService";
import { useAuth } from "@/services/authorization/AuthContext";
import { ISubCategory } from "@/models/JobCategories";
import { toast } from "react-toastify";

type Props = {
  title: string;
  id: string;
};

const HomeDropdownButton: FunctionComponent<Props> = ({ title, id }) => {
  const { jobCategories } = useAuth();
  const jobService = new JobServices();
  const [list, setList] = useState<Array<ISubCategory>>([]);
  const router = useRouter();
  const { isProfileBuild, isActive } = useAuth();
  useEffect(() => {
    setList(jobService.returnSubCategories(jobCategories, title));
  }, []);

  const onClick = (e: ISubCategory) => {
    if (!isActive) {
      toast.info("Please login to find helpers in your area");
      router.push("/Login");
    } else if (!isProfileBuild) {
      toast.warning("Please build your profile first before finding helpers in your area.");
      router.push("/Landing");
    } else {
      let data: any = { queryCat: title, querySubCat: e.name };
      router.push({ pathname: Routes.mapSearch, query: data });
    }
  };

  return (
    <div key={id} className="dropdown pe-2">
      <button
        className={`btn btn-secondary ${styles.headerButtonCSS}`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {title}
      </button>

      <ul className="dropdown-menu">
        {list.map((e, index) => (
          <li key={`${e.jobTypeId ?? "-"} ${index}`}>
            <button className="dropdown-item" onClick={(p0) => onClick(e)}>
              {e.name ?? "-"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeDropdownButton;
