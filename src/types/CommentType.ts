// CommentType.ts

export interface CommentListItem {
    reportedId: number;
    reporter: string;        // 신고한 사람
    reason: string;          // 신고 사유
    reportedDate: string;    // 신고 날짜
    commentWriter: string;   // 댓글 작성자
    commentDate: string;     // 댓글 작성 날짜
    content: string;         // 댓글 내용
  }