import axios from "axios";


import { toast } from 'react-toastify';
type EthAddress = `0x${string}`;
export const claim = async (publicKey: EthAddress | undefined) => {
  let toastId;
  try {
    const data = {
      publicKey,
    };
    console.log("🚀 ~ claim ~ data.publicKey:", data.publicKey)
    toastId = toast.loading("Waiting");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/claim`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer your-token'
        },
      }
    );
    toast.dismiss(toastId);
    toast.success(response.data.message);
  } catch (err) {
    console.log("🚀 ~ claim ~ toastId:", toastId)

    toast.dismiss(toastId);
    console.error("Error:", err);
    toast.error("Can't claim");
  }

};