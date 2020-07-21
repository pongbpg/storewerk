import React from 'react';
import { Link } from 'react-router-dom';
const NotFoundPage = () => (
  <div id="notfound">
    <div className="notfound">
      <div className="notfound-404">
        <h1>404</h1>
        <h2>ไม่พบหน้าที่ต้องการ</h2>
      </div>
      <Link to="/home">หน้าหลัก</Link>
    </div>
  </div>
)
export default NotFoundPage;
