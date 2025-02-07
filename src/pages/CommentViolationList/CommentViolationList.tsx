// src/pages/CommentViolationList/CommentViolationList.tsx

import React, { useEffect, useState } from 'react';

import './CommentViolationList.css';
import { CommentListItem } from '../../types/CommentType';
import { blockComment, getViolatedComments } from '../../api/baseApi.ts';
  
  const CommentViolationList: React.FC = () => {
    const [violations, setViolations] = useState<CommentListItem[]>([]);
  
    // 더미 데이터 예시
    useEffect(() => {
      // const dummyData: CommentListItem[] = [
      //   {
      //     id: 101,
      //     reporter: '신고자C',
      //     reason: '광고성 댓글',
      //     reportedDate: '2025-01-03',
      //     commentWriter: '댓글작성자A',
      //     commentDate: '2025-01-02',
      //     content: '이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다. 이 댓글은 광고입니다.',
      //     checked: false
      //   },
      //   {
      //     id: 102,
      //     reporter: '신고자D',
      //     reason: '욕설 포함',
      //     reportedDate: '2025-01-04',
      //     commentWriter: '댓글작성자B',
      //     commentDate: '2025-01-03',
      //     content: '심한 욕이 포함된 댓글입니다',
      //     checked: false
      //   }
      // ];

      getViolatedComments()
            .then((data) => {
              console.log('가공된 목록:', data);
              setViolations(data);
            })
            .catch((err) => {
              console.error('에러 발생:', err);
            });
            
          }, []);
  
    // 댓글 신고 승인/반려 처리
        const handleDeletePost = async (id: number, approve: boolean) => {
          // // TODO: 실제 API 연동
          const processResult = approve ? 'APPROVED' : 'REJECTED';
          try {
            await blockComment({
                reportedId: id,
                process: processResult,
            });
            console.log('댓글 ID:', id);
            alert(`선택된 댓글(${id}) 신고가 처리되었습니다.`);
            setViolations(prev => prev.filter(item => item.reportedId !== id));
          } catch (err) {
            console.error('승인 실패:', err);
          }
        }
  
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
              <tr key={v.reportedId}>
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
                        <button onClick={() => handleDeletePost(v.reportedId, true)}>승인</button>
                        <button onClick={() => handleDeletePost(v.reportedId, false)}>반려</button>
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