// src/api/courseApi.ts
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface CourseData {
  title: string;
  description: string[];
  teachersCount: number;
  courseHighlights: string[];
  overallHours: number;
  moduleLeader: string;
  category: string;
  learningFormat: Array<{
    name: string;
    description: string;
  }>;
  price: number;
  curriculum: Array<{
    title: string;
    duration: number;
    description: string;
  }>;
}

export const createCourse = async (courseData: CourseData) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create course');
    }

    return data.data;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};