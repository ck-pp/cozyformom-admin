// CozylogType.ts

export interface CozylogListItem {
  reportId: number;
  reporter: string;       // 신고한 사람 닉네임
  reporterId: number;     // 신고한 사람 id
  reason: string;         // 신고 사유
  reportedDate: string;   // 신고 날짜
  title: string;          // 코지로그 제목
  content: string;        // 코지로그 내용
  writer: string;         // 코지로그 작성자 닉네임
  writerId: number;       // 코지로그 작성자 id
  postedDate: string;     // 코지로그 작성 날짜
}