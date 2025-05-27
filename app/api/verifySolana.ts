//import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useAccount, useSignMessage } from "wagmi";
import { useSignature } from "../context/signContext";
import axios from "axios";

export const verifySolana = async (publicKey: PublicKey | null, address: `0x${string}` | undefined, signature: Uint8Array<ArrayBufferLike> | null) => {
  try {
    console.log("🚀 ~ verifySolana ~ signature:", signature)
    console.log("🚀 ~ verifySolana ~ address:", address)
    console.log(publicKey);
    
    if (!publicKey || !address! || !signature) {
      throw new Error("publickey and address and signature is required");
    }
    //const message = publicKey.toString();


    const data = {
      publicKey,
      address,
      signature,
    };
    console.log("🚀 ~ verifySolana ~ data.signature:", data.signature)
    console.log("🚀 ~ verifySolana ~ data.address:", data.address)
    console.log("🚀 ~ verify ~ data.publicKey:", data.publicKey);
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/verifySolana`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer your-token'
        },
      }
    );
    console.log("🚀 ~ verifySolana ~ response:", response)


  } catch (err) {

    console.error("Error:", err);
  }

};