
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const registerUser = async (userData: {
  fullname: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  citizenshipImageUrl: string;
  plan: string;
  courseEnrolled: string;
}): Promise<{
  success: boolean;
  message: string;
  userId: string;
}> => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return response.json();
};