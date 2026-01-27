import { FunctionComponent, useState } from "react";
import { CErrorString } from "@/components/form/CError";
import styles from "@/styles/Forms.module.css";
import { CH5Label } from "../reusable/labels/CH5Label";

type Props = {
  name: string;
  id: string;
  hint?: string;
  className?: string | undefined;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  readonly: boolean;
  isMandatory?: boolean;
  hideError?: boolean;
  maxLength?: number;
  showTitle?: boolean;
  wordLimit?: number; // New prop for word limit (optional)
};

export const CInputArea: FunctionComponent<Props> = ({ wordLimit = 500, ...Props }) => {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    // Count words by splitting based on spaces and filtering out empty values
    const wordsArray = inputValue.trim().split(/\s+/).filter(Boolean);
    const currentWordCount = wordsArray.length;

    // Enforce word limit
    if (currentWordCount <= wordLimit) {
      setWordCount(currentWordCount);
      Props.onChange(e);
    }
  };

  const remainingWords = wordLimit - wordCount;

  return (
    <div className={`${styles.inputArea} ${Props.className}`}>
      {Props.showTitle !== false && (
        <div className="d-flex flex-row">
          <CH5Label label={Props.name} />
          {Props.isMandatory && <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>}
        </div>
      )}
      <textarea
        name={Props.id}
        className="form-control"
        id={Props.id}
        placeholder={Props.hint}
        value={Props.value}
        onChange={handleChange}
        readOnly={Props.readonly}
        maxLength={Props.maxLength} // Max length removed, word count is enforced instead
      />
      <small className="text-muted">
        {remainingWords >= 0 ? `${remainingWords} words remaining` : "Word limit exceeded"}
      </small>
      {!Props.hideError && (
        <CErrorString
          error={Props.error}
          className={styles.errorMessageWithExtraHeight}
        />
      )}
    </div>
  );
};
