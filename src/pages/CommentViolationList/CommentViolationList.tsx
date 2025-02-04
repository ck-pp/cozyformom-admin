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
          content: '이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다.',
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
  
    // 댓글 삭제 승인/반려 처리
    const handleDeletePost = (id: number, approve: boolean) => {
  
      // TODO: 댓글 삭제 API 연동
      if (approve) {  // 댓글 신고 승인
        console.log('댓글 ID:', id);
        alert(`선택된 댓글(${id}) 신고가 승인되었습니다.`);
      } else {  // 댓글 신고 반려
        console.log('댓글 ID:', id);
        alert(`선택된 댓글(${id}) 신고가 반려되었습니다.`);
      }

    //   삭제 후 목록 갱신
      setViolations(prev => prev.filter(item => item.id !== id));
    };

  
    return (
      <div className="comment-violation-page">
        <h2>코지로그 댓글 신고 리스트</h2>
  
        <table className="comment-violation-table">
          <thead>
            <tr>
              <th>신고자</th>
              <th>신고 사유</th>
              <th>신고 날짜</th>
              <th>댓글 작성자</th>
              <th>댓글 작성 날짜</th>
              <th>댓글 내용</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id}>
                <td>{v.reporter}</td>
                <td>{v.reason}</td>
                <td>{v.reportedDate}</td>
                <td>{v.commentWriter}</td>
                <td>{v.commentDate}</td>
                <td style = {{width: '40%', textAlign: 'left'}}>{v.content}</td>
                <td>
                    <div style = {{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center'
                    }}>
                        <button onClick={() => handleDeletePost(v.id, true)}>승인</button>
                        <button onClick={() => handleDeletePost(v.id, false)}>반려</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default CommentViolationList;