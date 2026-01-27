import { MouseEventHandler } from "react";
import Link from "next/link";
import CButton from "./CButton";

type Props = {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  color?: string;
  url: string;
};

export const CBNavButton: React.FC<Props> = ({
  title,
  onClick,
  color,
  url,
}) => {
  return (
    <Link href={url}>
      <CButton label={title} />
    </Link>
  );
};
