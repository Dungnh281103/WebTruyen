import React from 'react';
import { Link } from 'react-router-dom'; // Giả sử dùng React Router
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 1. Import FontAwesomeIcon
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'; // 2. Import icon cụ thể

function SectionTitle({ title, icon, viewAllLink }) {
  return (
    <div className="section-title-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
      <h2 style={{ margin: 0, fontSize: '1.5em' }}>
        {/* Giữ nguyên phần hiển thị icon và title bên trái */}
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {title}
      </h2>
      {viewAllLink && (
        <Link to={viewAllLink} style={{ textDecoration: 'none', color: '#b78a28', display: 'flex', alignItems: 'center', fontSize:'15px' /* Căn chỉnh icon nếu cần */ }}>
          {/* 3. Thay thế '>>' bằng FontAwesomeIcon */}
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </Link>
      )}
    </div>
  );
}

export default SectionTitle;