export interface Resource {
  id: string;
  mimeType: string;
  webViewLink: string;
  year: string;
  semester: string;
  courseName: string;
  courseCode: string;
  category?: string;
  teacherName: string;
  type: string;
  tags: string[];
  name: string;
  downloadUrl: string;
} 