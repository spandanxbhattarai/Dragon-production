// types.ts
export type CourseCategory =
  | "All Courses"
  | "Engineering Entrance Preparation"
  | "Management Entrance Preparation";

export type Course = {
  _id: string;
  title: string;
  description: string[];
  category: CourseCategory;
  studentsEnrolled: number;
  teachersCount: number;
  overallHours: number;
  price: number;
  moduleLeader: string;
  courseHighlights: string[];
  curriculum: Array<{
    title: string;
    duration: number;
    description: string;
  }>;
  learningFormat: Array<{
    name: string;
    description: string;
  }>;
  image?: string;
};


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const fetchCourses = async (
  page: number = 1,
  limit: number = 10
): Promise<{ courses: Course[]; totalPages: number }> => {
  let url = `${BASE_URL}/courses?page=${page}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }

  const responseData = await response.json();

  if (responseData.status === "success" && responseData.data) {
    return {
      courses: responseData.data.courses || [],
      totalPages: responseData.data.pagination?.totalPages || 1,
    };
  }

  throw new Error("Received unexpected data format from the server");
};