import axios from "axios";


export const getQuizs = async () => {

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/quiz/allquiz`,    
      {
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer your-token'
        },
      }
    );
    console.log(response.data);
    if (response.data) return response.data.quizs;
    return null
  } catch (err) {
    console.error("Error:", err);
  }
};
