// src/pages/CozyLogViolationList/CozyLogViolationList.tsx

import React, { useEffect, useState } from 'react';
import './CozyLogViolationList.css';
import { CozylogListItem } from '../../types/CozylogType';
import { blockCozylog, getViolatedCozylogs } from '../../api/baseApi.ts';

// TODO: 코지로그 신고 리스트에서도 일괄삭제 필요한지 논의하기
const CozyLogViolationList: React.FC = () => {
    const [violations, setViolations] = useState<CozylogListItem[]>([]);
    const [selectedViolation, setSelectedViolation] = useState<CozylogListItem | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
  
    // 예시: 더미 데이터
    useEffect(() => {
    //   const dummyData: CozylogListItem[] = [
    //     {
    //       reportedId: 1,
    //       reporter: '신고자A',
    //       reason: '부적절한 내용',
    //       reportedDate: '2025-01-01',
    //       title: '문제의 코지로그문제의 코지로그문제의 코지로그문제의 코지로그문제의 코지로그',
    //       content: '명령어를 실행하여 해당 프로세스를 중지합니다. 이러한 방법으로 포트 충돌 문제를 해결할 수 있습니다.다른 포트로 변경하기 가장 간단한 해결책은 프로젝트에서 사용하는 포트 번호를 변경하는 것입니다. 이를 위해서는 프로젝트의 코드에서 포트 번호를 수정하거나, 환경 변수를 변경해야 할 수도 있습니다. ',
    //       writer: '작성자X',
    //       postedDate: '2024-12-31'
    //     },
    //     {
    //       reportedId: 2,
    //       reporter: '신고자B',
    //       reason: '욕설 포함',
    //       reportedDate: '2025-01-02',
    //       title: '또 다른 문제의 코지로그',
    //       content: '또 다른 코지로그 내용...',
    //       writer: '작성자Y',
    //       postedDate: '2025-01-01'
    //     }
    //   ];
    getViolatedCozylogs()
      .then((data) => {
        console.log('가공된 목록:', data);
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
      // // TODO: 실제 API 연동
      const processResult = approve ? 'APPROVED' : 'REJECTED';
      try {
        await blockCozylog({
            reportedId: id,
            process: processResult,
        });
        console.log('게시글 ID:', id);
        alert(`선택된 게시글(${id}) 신고가 처리되었습니다.`);
        setViolations(prev => prev.filter(item => item.reportedId !== id));
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
              <tr key={v.reportedId} onClick={() => handleRowClick(v)}>
                <td>{v.reporter}</td>
                <td>{v.reason}</td>
                <td>{v.reportedDate}</td>
                <td>{v.title}</td>
                <td>{v.writer}</td>
                
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
              <p><strong>신고자:</strong> {selectedViolation.reporter}</p>
              <p><strong>신고 사유:</strong> {selectedViolation.reason}</p>
              <p><strong>신고 날짜:</strong> {selectedViolation.reportedDate}</p>
              <hr color="lightgrey" />
              <h4>✅ 코지로그 상세</h4>
              <p><strong>제목:</strong> {selectedViolation.title}</p>
              <p><strong>내용:</strong> {selectedViolation.content}</p>
              <p><strong>작성자:</strong> {selectedViolation.writer}</p>
              <p><strong>작성 날짜:</strong> {selectedViolation.postedDate}</p>
              <div style = {{
                display: 'flex',
                justifyContent: 'end',
                gap: '1rem',
              }}>
              <button onClick={() => handleDeletePost(selectedViolation.reportedId, true)}>승인</button>
              <button onClick={() => handleDeletePost(selectedViolation.reportedId, false)}>반려</button>
              <button onClick={handleCloseModal}>닫기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default CozyLogViolationList;