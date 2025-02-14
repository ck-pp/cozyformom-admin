// src/pages/CommentViolationList/CommentViolationList.tsx

import React, { useEffect, useState } from 'react';

import './CommentViolationList.css';
import { CommentListItem } from '../../types/CommentType';
import { blockComment, getViolatedComments } from '../../api/baseApi.ts';
  
  const CommentViolationList: React.FC = () => {
    const [violations, setViolations] = useState<CommentListItem[]>([]);
  
    useEffect(() => {
      getViolatedComments()
      .then((data) => {
        setViolations(data);
      })
      .catch((err) => {
        console.error('에러 발생:', err);
      });
            
    }, []);
  
    // 댓글 신고 승인/반려 처리
    const handleDeletePost = async (id: number, approve: boolean) => {
      const processResult = approve ? 'APPROVED' : 'REJECTED';
      try {
        await blockComment({
          reportId: id,
          process: processResult,
        });
        if (approve) {
          alert(`선택된 게시글(${id}) 신고가 승인되었습니다.`);
        } else {
          alert(`선택된 게시글(${id}) 신고가 반려되었습니다.`);
        }
        setViolations(prev => prev.filter(item => item.reportId !== id));
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
              <tr key={v.reportId}>
                {/* 신고자 닉네임이 존재하면 닉네임을, 존재하지 않으면 id를 출력한다. */}
                <td>{v.reporter == null ? `id ${v.reporterId}` : v.reporter}</td>
                <td>{v.reason}</td>
                <td>{v.reportedDate}</td>
                {/* 댓글 작성자 닉네임이 존재하면 닉네임을, 존재하지 않으면 id를 출력한다. */}
                <td>{v.commentWriter == null ? `id ${v.commentWriterId}` : v.commentWriter}</td>
                <td>{v.commentDate}</td>
                <td style = {{width: '40%', textAlign: 'left'}}>{v.content}</td>
                <td>
                    <div style = {{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center'
                    }}>
                        <button onClick={() => handleDeletePost(v.reportId, true)}>승인</button>
                        <button onClick={() => handleDeletePost(v.reportId, false)}>반려</button>
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