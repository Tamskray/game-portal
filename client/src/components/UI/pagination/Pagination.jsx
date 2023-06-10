import React from "react";

import Button from "../Button/Button";

const Pagination = ({ pagesArray, currentPage, changePage }) => {
  return (
    <>
      {pagesArray.map((page) =>
        currentPage === page ? (
          <Button
            key={page}
            label={page + 1}
            inverse
            onClick={() => changePage(page)}
          />
        ) : (
          <Button
            key={page}
            label={page + 1}
            onClick={() => changePage(page)}
          />
        )
      )}
    </>
  );
};

export default Pagination;
