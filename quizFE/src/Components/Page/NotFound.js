import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}>
      <h1>404 - Không tìm thấy trang</h1>
      <p className="mt-4 fs-5">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="fs-5">Quay về trang chủ</Link>
    </div>
  );
};

export default NotFound;
