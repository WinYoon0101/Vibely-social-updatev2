import React, { memo } from "react";

function Popper({ children, className = "" }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export default memo(Popper);
