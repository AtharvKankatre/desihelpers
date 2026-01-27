import { FunctionComponent, ReactNode } from "react";
import useTranslation from "next-translate/useTranslation";

type Props = {
  label: ReactNode;  // Allow ReactNode for flexibility
  className?: string;
};

export const CLabel: FunctionComponent<Props> = ({ label, className }) => {
  const { t } = useTranslation("common");

  // Check if the label is a string before passing to the t function
  const translatedLabel = typeof label === 'string' ? t(label) : label;

  return <div className={className}>{translatedLabel}</div>;
};
