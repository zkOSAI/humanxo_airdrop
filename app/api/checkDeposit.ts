import axios from "axios";
import { PublicKey } from "@solana/web3.js";
export const checkDeposit = async (sig: string, quizId: string, publicKey: PublicKey | null) => {
    try {
        const data = {
        sig,
        quizId,
        publicKey,
        };
        const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/quiz/checkDeposit`,
        data,
        {
            headers: {
            "Content-Type": "application/json",
            // Add any authentication headers if needed
            // 'Authorization': 'Bearer your-token'
            },
        }
        );
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}