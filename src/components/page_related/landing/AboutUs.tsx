import { CH6Label } from "@/components/reusable/labels/CH6Label";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { CParagraph } from "@/components/reusable/labels/CParagraph";
import styles from "@/styles/Common.module.css";
import Link from "next/link";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";

export const CAboutUs = () => {
  const { mobile } = useAppMediaQuery();
  return (
    <div className="container col-md-10">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5 col-sm-12">
          <img
            className="w-100"
            src="/assets/img_text_language_cloud.svg"
            alt="Word Cloud"
          />
        </div>
        <div className={`col-md-7 col-sm-12 ${mobile ? "mt-4" : "mt-0"}`}>
          <CH5Label className={styles.pLabel} label="Why Choose Us" />
          <CParagraph
            className={styles.bodyText}
            label="Look around your house and the help you need so you can relax. Then
          look at how much effort it takes to find one helper today? We solve it
          for you and at no cost to you. We are the first ever created
          socio-economic platform to connect people looking to help each other
          in and around the community."
          />

          <Link href="/home/AboutUs">
            <CH6Label label="Read More" />
          </Link>
        </div>
      </div>
    </div>
  );
};
