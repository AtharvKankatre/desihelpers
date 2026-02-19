import { FunctionComponent } from "react";
import Pagination from "react-bootstrap/Pagination"; // Assuming you are using Bootstrap for pagination

interface CPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CPagination: FunctionComponent<CPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const paginationItems = [];
  for (let page = 1; page <= totalPages; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center my-4"> {/* Center the pagination */}
      <Pagination>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        />
        {paginationItems}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        />
      </Pagination>
    </div>
  );
};

export default CPagination;
