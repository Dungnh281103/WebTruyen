import React from "react";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="" style={{ margin: "0 150px" }}>
        <div className="page-content">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
