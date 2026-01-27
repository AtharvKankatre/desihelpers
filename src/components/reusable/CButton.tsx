interface Props {
  onClick?: () => void;
  label: string;
  isLoading?: boolean;
  className?: string;
  buttonClassName?: string;
}

const CButton: React.FC<Props> = ({
  onClick,
  label,
  isLoading,
  className,
  buttonClassName,
}) => {
  const handleClick = () => {
    if (onClick != undefined) {
      onClick();
    }
  };

  return (
    <div className={`me-1 ${className}`}>
      <button
        className={`${buttonClassName ?? "btn btn-secondary btn-md"}`}
        onClick={handleClick}
        disabled={isLoading}
      >
        {label}
        {isLoading == true && (
          <span
            className="spinner-border spinner-border-sm mb-2"
            role="status"
            aria-hidden="true"
          ></span>
        )}
      </button>
    </div>
  );
};

export default CButton;
