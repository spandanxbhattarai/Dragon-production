const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getClassMaterialsByBatchId = async (batchId: string, page: number, limit: number) => {
  try {
    const response = await fetch(
        `${base_url}/classMaterial/batch/${batchId}?page=${page}&limit=${limit}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};