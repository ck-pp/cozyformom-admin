// src/pages/CommentViolationList/CommentViolationList.tsx

import React, { useEffect, useState } from 'react';
import './CommentViolationList.css';

interface CommentViolation {
    id: number;
    reporter: string;        // 신고한 사람
    reason: string;          // 신고 사유
    reportedDate: string;    // 신고 날짜
    commentWriter: string;   // 댓글 작성자
    commentDate: string;     // 댓글 작성 날짜
    content: string;         // 댓글 내용
    checked?: boolean;       // 일괄 선택/삭제를 위한 체크박스 여부
  }
  
  const CommentViolationList: React.FC = () => {
    const [violations, setViolations] = useState<CommentViolation[]>([]);
  
    // 더미 데이터 예시
    useEffect(() => {
      const dummyData: CommentViolation[] = [
        {
          id: 101,
          reporter: '신고자C',
          reason: '광고성 댓글',
          reportedDate: '2025-01-03',
          commentWriter: '댓글작성자A',
          commentDate: '2025-01-02',
          content: '이 댓글은 광고입니다.',
          checked: false
        },
        {
          id: 102,
          reporter: '신고자D',
          reason: '욕설 포함',
          reportedDate: '2025-01-04',
          commentWriter: '댓글작성자B',
          commentDate: '2025-01-03',
          content: '심한 욕이 포함된 댓글입니다',
          checked: false
        }
      ];
      setViolations(dummyData);
    }, []);
  
    // 개별 체크박스 선택 토글
    const handleCheckboxChange = (id: number) => {
      setViolations(prev =>
        prev.map(v =>
          v.id === id ? { ...v, checked: !v.checked } : v
        )
      );
    };
  
    // 전체선택 체크박스
    const handleSelectAll = (checked: boolean) => {
      setViolations(prev => prev.map(v => ({ ...v, checked })));
    };
  
    // 선택된 댓글 일괄 삭제(예시)
    const handleDeleteSelected = () => {
      const selectedIds = violations
        .filter(v => v.checked)
        .map(v => v.id);
  
      if (selectedIds.length === 0) {
        alert('선택된 댓글이 없습니다.');
        return;
      }
  
      // 실제 API 호출해서 일괄 삭제
      console.log('선택된 댓글 ID 목록:', selectedIds);
      alert(`선택된 댓글(${selectedIds.join(', ')})을 일괄 삭제합니다.`);
  
      // 삭제 성공 후 목록 갱신
      setViolations(prev => prev.filter(v => !selectedIds.includes(v.id)));
    };
  
    // 전체선택 체크박스가 ‘부분 선택'인지 여부를 간단히 구해볼 수 있음
    const allChecked = violations.length > 0 && 
                       violations.every((v) => v.checked);
    const someChecked = violations.some((v) => v.checked);
  
    return (
      <div className="comment-violation-page">
        <h2>코지로그 댓글 신고 리스트</h2>
  
        {/* 상단 일괄삭제 버튼 */}
        <div className="controls">
          <button onClick={handleDeleteSelected}>선택된 댓글 삭제</button>
        </div>
  
        <table className="comment-violation-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allChecked}
                  // indeterminate 상태를 위해서는 ref로 DOM 조작 필요(아래는 단순 예시)
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  // indeterminate 속성은 직접 DOM 조작 필요하나, 여기서는 예시로 생략
                />
              </th>
              <th>신고 번호</th>
              <th>신고자</th>
              <th>신고 사유</th>
              <th>신고 날짜</th>
              <th>댓글 작성자</th>
              <th>댓글 작성 날짜</th>
              <th>댓글 내용</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!v.checked}
                    onChange={() => handleCheckboxChange(v.id)}
                  />
                </td>
                <td>{v.id}</td>
                <td>{v.reporter}</td>
                <td>{v.reason}</td>
                <td>{v.reportedDate}</td>
                <td>{v.commentWriter}</td>
                <td>{v.commentDate}</td>
                <td>{v.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default CommentViolationList;