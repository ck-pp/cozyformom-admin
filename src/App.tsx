/* src/App.tsx */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CozyLogViolationList from './pages/CozyLogViolationList/CozyLogViolationList.tsx';
import CommentViolationList from './pages/CommentViolationList/CommentViolationList.tsx';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ display: 'flex', 
          justifyContent: 'center', /* 가운데 정렬 */
          alignItems: 'center',
          gap: '2rem',
          marginTop: '2rem' }}>
          <Link to="/cozylog-violations">코지로그 신고 목록</Link>
          <Link to="/comment-violations">댓글 신고 목록</Link>
        </nav>

        <Routes>
          <Route path="/cozylog-violations" element={<CozyLogViolationList />} />
          <Route path="/comment-violations" element={<CommentViolationList />} />
          {/* 기본 라우트 등 추가 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
