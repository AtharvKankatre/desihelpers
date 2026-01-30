import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CH4Label } from "@/components/reusable/labels/CH4Label";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import DesiHelpersIcon from "@/components/static/DesiHelpersIcon";
import { ISubCategory } from "@/models/JobCategories";
import { useAuth } from "@/services/authorization/AuthContext";
import { Routes } from "@/services/routes/Routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { Container, Image, ListGroup, ListGroupItem } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { CgMenuGridR } from "react-icons/cg";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { userProfileStore } from "@/stores/UserProfileStore";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import CookieService from "@/services/authorization/CookieService";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import Roles from "@/constants/ERoles";

type Props = {
  handleShow: () => void;
  handleClose: () => void;
  show: boolean;
};

export const CMobileCanvas: FunctionComponent<Props> = ({ ...Props }) => {
  const { jobCategories, isActive, setIsActive } = useAuth();
  const router = useRouter();
  const { mobile } = useAppMediaQuery();
  const { isProfileBuild } = useAuth();
  const roleStatus = Cookies.get(cookieParams.role);
  const isAdmin = roleStatus === Roles.Admin;

  const onClick = (e: ISubCategory, job: string) => {
    let data: any = { queryCat: job, querySubCat: e.name };
    router.push({ pathname: Routes.mapSearch, query: data });
    Props.handleClose();
  };

  const { reset } = userProfileStore();
  const logOut = () => {
    reset();
    window.location.href = Routes.login;
    CookieService.clearCookies();
    setIsActive(false);
  };

  return (
    <>
      <button
        className="d-flex flex-column justify-content-center align-items-center"
        onClick={Props.show ? Props.handleClose : Props.handleShow}
        style={{
          cursor: "pointer",
          background: "transparent",
          border: "none",
          padding: "8px",
          gap: "5px"
        }}
        aria-label={Props.show ? "Close menu" : "Open menu"}
      >
        <span style={{ width: "22px", height: "2px", backgroundColor: "white", borderRadius: "1px" }}></span>
        <span style={{ width: "22px", height: "2px", backgroundColor: "white", borderRadius: "1px" }}></span>
        <span style={{ width: "22px", height: "2px", backgroundColor: "white", borderRadius: "1px" }}></span>
      </button>

      <Offcanvas show={Props.show} onHide={Props.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Link
              className="navbar-brand"
              href="/Landing"
              onClick={Props.handleClose}
            >
              <DesiHelpersIcon />
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bgPrimary">
          {!isAdmin ? (
            <>
              {" "}
              <ListGroup horizontal className="text-center">
                <ListGroup.Item className="p-3 w-100 me-1 mobileOffCanvasButtons">
                  <Link
                    className="mobileOffCanvasButtonsLink"
                    href={Routes.landing}
                    onClick={Props.handleClose}
                  >
                    Home
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item className="p-3 w-100 mobileOffCanvasButtons">
                  <Link
                    className="mobileOffCanvasButtonsLink"
                    href={Routes.userProfile}
                    onClick={Props.handleClose}
                  >
                    My Profile
                  </Link>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup horizontal className="text-center mt-1">
                <ListGroup.Item className="p-3 w-100 me-1 mobileOffCanvasButtons">
                  <Link
                    className="mobileOffCanvasButtonsLink"
                    href={Routes.myPostedJobs}
                    onClick={Props.handleClose}
                  >
                    My Posted Jobs
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item className="p-3 w-100 mobileOffCanvasButtons bgSecondary text-light">
                  <Link
                    className="mobileOffCanvasButtonsLink text-light"
                    href={Routes.postJob}
                    onClick={Props.handleClose}
                  >
                    Post A Job
                  </Link>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="mt-4">
                <ListGroup.Item variant="light" className="p-3">
                  <CH4Label label="Quick Search" />
                  <ListGroup>
                    {jobCategories.map((job, index) => (
                      <CExpandablePanel
                        title={job.name ?? ""}
                        id={`job${index}`}
                        key={`job${index}`}
                      >
                        <ListGroup>
                          {job.subCategories?.map((cat, ind) => (
                            <ListGroup.Item
                              className="p-3"
                              key={`cat${ind}`}
                              onClick={() => onClick(cat, job.name ?? "")}
                            >
                              <div className="d-flex flex-row justify-content-between w-100">
                                {cat.name ?? "-"}
                                <MdOutlineKeyboardArrowRight />
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </CExpandablePanel>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              </ListGroup>
            </>
          ) : null}
          <div
            className="d-flex flex-row w-100 align-items-center p-2"
            onClick={() => logOut()}
          >
            <Image src="/assets/icons/form_icons/icon_logout.svg" height={34} />
            <div className="ms-2 text-light">{"Log out"}</div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
