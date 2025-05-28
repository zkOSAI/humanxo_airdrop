// frontend/utils/verifySolana.ts
import axios from "axios";
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

// Vesting contract ABI (add the functions you need)
const VESTING_CONTRACT_ABI = [
  "function claimTokens(uint256 totalAmount, uint256 nonce, uint256 deadline, bytes memory signature) external",
  "function getClaimableAmount(address user, uint256 totalAmount, uint256 nonce, uint256 deadline) external view returns (uint256 claimableNow, uint256 totalClaimed, uint256 totalAvailable)",
  "function verifySignature(address recipient, uint256 totalAmount, uint256 nonce, uint256 deadline, bytes memory signature) external view returns (bool)"
];

interface ClaimData {
  totalAmount: string;
  nonce: number;
  deadline: number;
  signature: string;
}

interface ClaimableAmountInfo {
  claimableNow: string;
  totalClaimed: string;
  totalAvailable: string;
}

interface VestingInfo {
  totalTokens: string;
  quarterlyAmount: string;
  vestingPeriod: string;
  claimFrequency: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
  claimData: ClaimData;
  vestingInfo: VestingInfo;
  metadata: {
    user: string;
    airdropStartTime: number;
    signatureExpiry: string;
  };
}

// Add callback type for claim info updates
type ClaimInfoCallback = (claimInfo: ClaimableAmountInfo) => void;
export const verifySolana = async (
  publicKey: PublicKey | null,
  address: `0x${string}` | undefined,
  signature: Uint8Array<ArrayBufferLike> | null
): Promise<{ success: boolean; claimData?: ClaimData; error?: string }> => {
  try {
    console.log("🚀 ~ verifySolana ~ signature:", signature);
    console.log("🚀 ~ verifySolana ~ address:", address);
    console.log("🚀 ~ verifySolana ~ publicKey:", publicKey);

    if (!publicKey || !address || !signature) {
      throw new Error("PublicKey, address, and signature are required");
    }

    const data = {
      publicKey: publicKey.toString(),
      address,
      signature,
    };

    console.log("🚀 ~ verifySolana ~ sending data:", data);

    // 📡 Call backend API
    const response = await axios.post<VerifyResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/verifySolana`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🚀 ~ verifySolana ~ response:", response.data);

    if (response.data.success && response.data.claimData) {
      console.log("✅ Verification successful, ready to claim tokens!");
      console.log("📋 Claim Data:", response.data.claimData);
      console.log("📊 Vesting Info:", response.data.vestingInfo);

      return {
        success: true,
        claimData: response.data.claimData
      };
    } else {
      console.log("❌ Verification failed:", response.data.message);
      return {
        success: false,
        error: response.data.message
      };
    }

  } catch (err: any) {
    console.error("❌ Error in verifySolana:", err);
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Unknown error"
    };
  }
};

export const getClaimableAmount = async (
  address: `0x${string}` | undefined,
  claimData: ClaimData,
  contractAddress: string,
  signer: ethers.Signer
): Promise<{ success: boolean; claimableInfo?: ClaimableAmountInfo; error?: string }> => {
  try {
    console.log("🔍 Getting claimable amount...");
    
    if (!address || !claimData) {
      throw new Error("Address and claim data are required");
    }

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, VESTING_CONTRACT_ABI, signer);

    // Get claimable amount
    const [claimableNow, totalClaimed, totalAvailable] = await contract.getClaimableAmount(
      address,
      claimData.totalAmount,
      claimData.nonce,
      claimData.deadline
    );

    const claimableInfo: ClaimableAmountInfo = {
      claimableNow: ethers.formatEther(claimableNow),
      totalClaimed: ethers.formatEther(totalClaimed),
      totalAvailable: ethers.formatEther(totalAvailable)
    };

    console.log("📊 Claimable info:", claimableInfo);

    return {
      success: true,
      claimableInfo
    };

  } catch (error: any) {
    console.error("❌ Error getting claimable amount:", error);
    return {
      success: false,
      error: error.message || "Failed to get claimable amount"
    };
  }
};

/**
 * Claim tokens from vesting contract
 */
export const claimVestingTokens = async (
  address: `0x${string}` | undefined,
  claimData: ClaimData,
  contractAddress: string,
  signer: ethers.Signer
): Promise<{ success: boolean; txHash?: string; error?: string; amount?: string }> => {
  let amount:  string = "";
  try {
    console.log("provider================", signer.provider);
    console.log("signer=====", signer);
    console.log("🔄 Claiming vesting tokens...");
    console.log("📋 Claim data:", claimData);
    const provider = signer.provider;
    console.log("🚀 ~ provider:", provider)
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, VESTING_CONTRACT_ABI, signer);

    // Get user address
    const userAddress = address;
    console.log("👤 User address:", userAddress);

    // Optional: Verify signature before claiming
    try {
      const isValidSignature = await contract.verifySignature(
        userAddress,
        claimData.totalAmount,
        claimData.nonce,
        claimData.deadline,
        claimData.signature
      );

      console.log("🔍 Signature verification:", isValidSignature);

      if (!isValidSignature) {
        throw new Error("Invalid signature from backend");
      }
    } catch (verifyError) {
      console.warn("⚠️ Could not verify signature:", verifyError);
      // Continue anyway - let the contract handle verification
    }

    // Check claimable amount
    try {
      const [claimableNow, totalClaimed, totalAvailable] = await contract.getClaimableAmount(
        userAddress,
        claimData.totalAmount,
        claimData.nonce,
        claimData.deadline
      );
      amount = ethers.formatEther(claimableNow);
      console.log("📊 Claimable info:");
      console.log("   Available now:", ethers.formatEther(claimableNow));
      console.log("   Total claimed:", ethers.formatEther(totalClaimed));
      console.log("   Total available:", ethers.formatEther(totalAvailable));

      if (claimableNow.toString() === "0") {
        throw new Error("No tokens available to claim at this time");
      }
    } catch (infoError) {
      console.warn("⚠️ Could not get claim info:", infoError);
      // Continue anyway
    }

    // Execute claim transaction
    console.log("🚀 Executing claim transaction...");

    const tx = await contract.claimTokens(
      claimData.totalAmount,
      claimData.nonce,
      claimData.deadline,
      claimData.signature
    );

    console.log("📤 Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt.transactionHash);
    const [claimableNow, totalClaimed, totalAvailable] = await contract.getClaimableAmount(
      userAddress,
      claimData.totalAmount,
      claimData.nonce,
      claimData.deadline
    );
    amount = ethers.formatEther(claimableNow);
    return {
      success: true,
      txHash: receipt.transactionHash,
      amount
    };

  } catch (error: any) {
    console.error("❌ Error claiming tokens:", error);

    // Parse common error messages
    let errorMessage = error.message;
    if (error.message.includes("Vesting has not started yet")) {
      errorMessage = "Vesting period has not started yet";
    } else if (error.message.includes("No tokens available to claim")) {
      errorMessage = "No tokens available to claim at this time";
    } else if (error.message.includes("Invalid signature")) {
      errorMessage = "Invalid authorization signature";
    } else if (error.message.includes("Signature expired")) {
      errorMessage = "Authorization signature has expired";
    }

    return {
      success: false,
      error: errorMessage,
      amount
    };
  }
};

/**
 * Complete verification and claiming process
 */
export const verifyAndClaim = async (
  publicKey: PublicKey | null,
  address: `0x${string}` | undefined,
  signature: Uint8Array<ArrayBufferLike> | null,
  contractAddress: string,
  signer: ethers.Signer
): Promise<{ success: boolean; txHash?: string; error?: string; amount?: string }> => {
  try {
    // Step 1: Verify Solana signature and get claim data
    console.log("1️⃣ Verifying Solana signature...");
    const verifyResult = await verifySolana(publicKey, address, signature);

    if (!verifyResult.success || !verifyResult.claimData) {
      return {
        success: false,
        error: verifyResult.error || "Verification failed"
      };
    }

    // Step 2: Claim tokens from vesting contract
    console.log("2️⃣ Claiming tokens from vesting contract...");
    console.log("🚀 ~ signer:", signer)
    console.log("🚀 ~ contractAddress:", contractAddress)
    console.log("🚀 ~   verifyResult.claimData,:", verifyResult.claimData,)
    console.log("🚀 ~ address:", address)
    const claimResult = await claimVestingTokens(
      address,
      verifyResult.claimData,
      contractAddress,
      signer
    );


    return claimResult;

  } catch (error: any) {
    console.error("❌ Error in verifyAndClaim:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
};