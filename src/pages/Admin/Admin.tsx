// pages/AdminPage.tsx

import React from 'react';
import './Admin.css'
import { Routes, Route, Link } from 'react-router-dom';
import CozyLogViolationList from '../CozyLogViolationList/CozyLogViolationList.tsx';
import CommentViolationList from '../CommentViolationList/CommentViolationList.tsx';

function AdminPage() {
  return (
    <div className="admin-container">
      <h2>관리자 페이지</h2>
      <nav style={{ display: 'flex', 
                justifyContent: 'center', /* 가운데 정렬 */
                alignItems: 'center',
                gap: '2rem',
                marginTop: '2rem' }}>
                <Link to="/admin/cozylog-violations">코지로그 신고 목록</Link>
                <Link to="/admin/comment-violations">댓글 신고 목록</Link>
              </nav>

      {/* 서브 라우팅 */}
      <Routes>
        <Route path="cozylog-violations" element={<CozyLogViolationList />} />
        <Route path="comment-violations" element={<CommentViolationList />} />
        {/* <Route path="*" element={<NotFoundInAdmin />} /> */}
      </Routes>
    </div>
  );
}

export default AdminPage;
