// CommentType.ts

export interface CommentListItem {
    reportId: number;
    reporter: string;        // 신고한 사람 닉네임
    reporterId: number;      // 신고한 사람 id
    reason: string;          // 신고 사유
    reportedDate: string;    // 신고 날짜
    commentWriter: string;   // 댓글 작성자 닉네임
    commentWriterId: number; // 댓글 작성자 id
    commentDate: string;     // 댓글 작성 날짜
    content: string;         // 댓글 내용
  }