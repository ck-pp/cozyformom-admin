// src/pages/CozyLogViolationList/CozyLogViolationList.tsx

import React, { useEffect, useState } from 'react';
import './CozyLogViolationList.css';
import { CozylogListItem } from '../../types/CozylogType';
import { blockCozylog, getViolatedCozylogs } from '../../api/baseApi.ts';

const CozyLogViolationList: React.FC = () => {
    const [violations, setViolations] = useState<CozylogListItem[]>([]);
    const [selectedViolation, setSelectedViolation] = useState<CozylogListItem | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
  
    useEffect(() => {
      getViolatedCozylogs()
      .then((data) => {
        setViolations(data);
      })
      .catch((err) => {
        console.error('에러 발생:', err);
      });
      
    }, []);
  
    // 테이블 행 클릭 시 모달 오픈
    const handleRowClick = (violation: CozylogListItem) => {
      setSelectedViolation(violation);
      setShowModal(true);
    };
  
    // 모달 닫기
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedViolation(null);
    };
  
    // 게시글 신고 승인/반려 처리
    const handleDeletePost = async (id: number, approve: boolean) => {
      const processResult = approve ? 'APPROVED' : 'REJECTED';
      try {
        await blockCozylog({
            reportId: id,
            process: processResult,
        });
        if (approve) {
          alert(`선택된 게시글(${id}) 신고가 승인되었습니다.`);
        } else {
          alert(`선택된 게시글(${id}) 신고가 반려되었습니다.`);
        }
        setViolations(prev => prev.filter(item => item.reportId !== id));
        handleCloseModal();
      } catch (err) {
        console.error('승인 실패:', err);
      }
    }
    
    return (
      <div className="cozylog-violation-page">
        <h2>코지로그 신고 리스트</h2>
        <table className="cozylog-violation-table">
          <thead>
            <tr>
              <th>신고한 사람</th>
              <th>신고 사유</th>
              <th>신고 날짜</th>
              <th>코지로그 제목</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.reportId} onClick={() => handleRowClick(v)}>
                {/* 신고자 닉네임이 존재하면 닉네임을, 존재하지 않으면 id를 출력한다. */}
                <td>{v.reporter == null ? `id ${v.reporterId}` : v.reporter}</td>
                <td>{v.reason}</td>
                <td>{v.reportedDate}</td>
                <td>{v.title}</td>
                {/* 작성자 닉네임이 존재하면 닉네임을, 존재하지 않으면 id를 출력한다. */}
                <td>{v.writer == null ? `id ${v.writerId}` : v.writer}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* 상세 팝업 (모달) */}
        {showModal && selectedViolation && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}  // 모달 영역 클릭 시 닫히지 않도록
            >
              <h3>📌 신고 상세 페이지</h3>
              <p><strong>신고자:</strong> {selectedViolation.reporter == null ? `id ${selectedViolation.reporterId}` : selectedViolation.reporter}</p>
              <p><strong>신고 사유:</strong> {selectedViolation.reason}</p>
              <p><strong>신고 날짜:</strong> {selectedViolation.reportedDate}</p>
              <hr color="lightgrey" />
              <h4>✅ 코지로그 상세</h4>
              <p><strong>제목:</strong> {selectedViolation.title}</p>
              <p><strong>내용:</strong> {selectedViolation.content}</p>
              <p><strong>작성자:</strong> {selectedViolation.writer == null ? `id ${selectedViolation.writerId}` : selectedViolation.writer}</p>
              <p><strong>작성 날짜:</strong> {selectedViolation.postedDate}</p>
              <div style = {{
                display: 'flex',
                justifyContent: 'end',
                gap: '1rem',
              }}>
              <button onClick={() => handleDeletePost(selectedViolation.reportId, true)}>승인</button>
              <button onClick={() => handleDeletePost(selectedViolation.reportId, false)}>반려</button>
              <button onClick={handleCloseModal}>닫기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default CozyLogViolationList;