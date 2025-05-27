// src/queries/user/getUser.ts
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = async (publicKey: any) => {
    const data = { publicKey };
    
    console.log("🚀 ~ getUser ~ publicKey:", publicKey)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/info`, data, {
        headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if needed
            // 'Authorization': 'Bearer your-token'
        }
    });
    if (res.data) return res.data;
    return null
};