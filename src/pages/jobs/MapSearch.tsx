import withAuth from "@/services/authorization/ProfileService";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MapSearchFilters from "@/components/maps/MapSearchFilters";
import IMapSearchFilters from "@/models/MapFilters";
import { MapRadius } from "@/constants/EMapRadius";
import { IJobs } from "@/models/Jobs";
import MapServices from "@/components/functions/jobs/FilterJobsForMap";
import mapStyles from "@/styles/Map.module.css";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { useRouter } from "next/router";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CMapAndCardList } from "@/components/maps/CMapAndCardList";
import { useFormik } from "formik";
import { IJobCategories } from "@/models/JobCategories";
import { useAuth } from "@/services/authorization/AuthContext";
import { userProfileStore } from "@/stores/UserProfileStore";

const MapSearch: FunctionComponent = () => {
  const router = useRouter();
  const mapServices = new MapServices();
  const { queryCat, querySubCat } = router.query;
  const { jobCategories } = useAuth();
  const userProfile = userProfileStore((state) => state.userProfile);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [fJobs, setFJobs] = useState<IJobs[]>([]);

  const [seekers, setSeekers] = useState<IUserProfileModel[]>([]);
  const [fSeeker, setFSeekers] = useState<IUserProfileModel[]>([]);

  const [isLoading, setLoading] = useState<boolean>(true);

    // Load filters from localStorage if available
    const loadSavedFilters = (): IMapSearchFilters | null => {
      if (typeof window !== "undefined") {
        const savedFilters = localStorage.getItem("mapSearchFilters");
        if (savedFilters) {
          return JSON.parse(savedFilters);
        }
      }
      return null;
    };

      // Save filters to localStorage
  const saveFilters = (filters: IMapSearchFilters) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mapSearchFilters", JSON.stringify(filters));
    }
  };

  const initialValuesFromStorage = loadSavedFilters();

  // Set the initial values for formik
  let initialValues: IMapSearchFilters = initialValuesFromStorage || {
    category: "",
    subCategory: "",
    role: ViewTypesForMap.viewJobSeekers,
    diet: "",
    pets: "",
    radius: Object.values(MapRadius)[2],
    coordinates:
      userProfile != null
        ? [
            userProfile.location?.coordinates?.[1],
            userProfile.location?.coordinates?.[0],
          ]
        : [32.779167, -96.808891],
  } as IMapSearchFilters;

  // Setup ref for previous values
  const previousValues = useRef<IMapSearchFilters>(initialValues);

  // Setup formik
  const formik = useFormik<IMapSearchFilters>({
    initialValues: initialValues,
    validateOnChange: true,
    validate: (values) => {
      // Setup sub categories
      if (values.category !== previousValues.current.category) {
        values.subCategory = "";
        // formik.setFieldValue("subCategory", "", true);
        let t: IJobCategories[] = jobCategories.filter(
          (e) => e.name == values.category
        );
        if (t != null && t.length > 0) {
          formik.setFieldValue("subCategories", t[0].subCategories, true);
        }
      }

      onChangeFilter(values);
    },
    onSubmit: () => {},
  });

  // Initial loading of the page
  const fetchJobs = useCallback(async () => {
    setLoading(true);

    // Setup the category that has been selected in the previous section by the user
    let q: string = queryCat as string;
    if (q != null && q.length > 0) {
      formik.values.category = q;
      // Setup the sub-category as well
      let sq: string = querySubCat as string;

      if (sq != null && sq.length > 0) {
        formik.values.subCategory = sq;
        let t: IJobCategories[] = jobCategories.filter((e) => e.name == q);
        if (t != null && t.length > 0) {
          formik.values.subCategories = t[0].subCategories;
        }
      }
    }
    onChangeFilter(formik.values);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    fetchJobs();

    // Hide the global footer
    const globalFooter = document.getElementById("globalFooter");
    if (globalFooter) {
      globalFooter.style.display = "none";
    }

    // Clean up and restore the footer when the component unmounts
    return () => {
      if (globalFooter) {
        globalFooter.style.display = "";
      }
    };
  }, [fetchJobs]);

  // Called when the user clicks on the search button post advanced search
  const onChangeFilter = async (newFilter: IMapSearchFilters) => {
    setLoading(true);
    var data:
      | [IJobs[], IJobs[]]
      | [IUserProfileModel[], IUserProfileModel[]]
      | boolean = await mapServices.processMapFilters(
      previousValues.current,
      newFilter,
      jobs,
      seekers
    );
    if (data == false) {
      // Handle error over here
    } else if (newFilter.role == ViewTypesForMap.viewJobSeekers) {
      let d: [IUserProfileModel[], IUserProfileModel[]] = data as [
        IUserProfileModel[],
        IUserProfileModel[]
      ];
      setJobs([]);
      setFJobs([]);
      setSeekers(d[0] as IUserProfileModel[]);
      setFSeekers(d[1] as IUserProfileModel[]);
    } else {
      let d: [IJobs[], IJobs[]] = data as [IJobs[], IJobs[]];
      setSeekers([]);
      setFSeekers([]);
      setJobs(d[0]);
      setFJobs(d[1]);
    }
    previousValues.current = newFilter;
    saveFilters(newFilter); //save filters to local storage
    setLoading(false);
  };

  if (initialLoad) return <CCommonLoader />;

  return (
    <div className={`${mapStyles.mapMasterBody}`}>
      {/* This contains the search filters */}

      <MapSearchFilters filters={formik} />

      {/* This contains the map and the display for jobs / seekers */}
      <CMapAndCardList
        fJobs={fJobs}
        fSeeker={fSeeker}
        filters={formik.values}
        isLoading={isLoading}
      />
    </div>
  );
};

export default withAuth(MapSearch);
