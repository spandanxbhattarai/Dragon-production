
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const uploadFile = async (file: File): Promise<{
    success: boolean;
    message: string;
    data: {
      url: string;
      public_id: string;
      format: string;
      size: number;
      original_filename: string;
    };
  }> => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch(`${BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
  
    return response.json();
  };