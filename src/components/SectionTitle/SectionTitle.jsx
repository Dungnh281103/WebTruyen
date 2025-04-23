import React from 'react';
import { Link } from 'react-router-dom';
import './SectionTitle.scss';
import { HiChevronDoubleRight } from 'react-icons/hi';

function SectionTitle({ title, icon, viewAllLink, viewAllText = "Xem tất cả" }) {
  return (
    <div className="section-header">
      <h2>
        {icon && <span className="section-icon">{icon}</span>}
        {title}
      </h2>
      {viewAllLink && (
        <Link to={viewAllLink} className="view-all">
          <span>{viewAllText}</span>
          <HiChevronDoubleRight className="icon" />
        </Link>
      )}
    </div>
  );
}

export default SectionTitle;