import React, { useState, useEffect } from 'react';
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { verifySolana, getClaimableAmount, verifyAndClaim } from '../api/verifySolana';

interface ClaimableAmountInfo {
  claimableNow: string;
  totalClaimed: string;
  totalAvailable: string;
}

interface ClaimData {
  totalAmount: string;
  nonce: number;
  deadline: number;
  signature: string;
}

interface VestingClaimComponentProps {
  publicKey: PublicKey | null;
  address: `0x${string}` | undefined;
  signature: Uint8Array<ArrayBufferLike> | null;
  contractAddress: string;
  signer: ethers.Signer;
}

const VestingClaimComponent: React.FC<VestingClaimComponentProps> = ({
  publicKey,
  address,
  signature,
  contractAddress,
  signer
}) => {
  const [claimableInfo, setClaimableInfo] = useState<ClaimableAmountInfo | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Function to fetch claimable amount
  const fetchClaimableAmount = async () => {
    if (!claimData || !address) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getClaimableAmount(address, claimData, contractAddress, signer);

      if (result.success && result.claimableInfo) {
        setClaimableInfo(result.claimableInfo);
      } else {
        setError(result.error || 'Failed to get claimable amount');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to verify and get claim data
  const handleVerify = async () => {
    if (!publicKey || !address || !signature) {
      setError('Missing required data for verification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifySolana(publicKey, address, signature);

      if (result.success && result.claimData) {
        setClaimData(result.claimData);

        // Auto-fetch claimable amount after verification
        const claimableResult = await getClaimableAmount(address, result.claimData, contractAddress, signer);

        if (claimableResult.success && claimableResult.claimableInfo) {
          setClaimableInfo(claimableResult.claimableInfo);
        } else {
          setError(claimableResult.error || 'Failed to get claimable amount');
        }

      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Verification failed');
      } else {
        setError('Verification failed');
      }
    } finally {
      setLoading(false);
    }

  };

  // Function to claim tokens
  const handleClaim = async () => {
    if (!publicKey || !address || !signature) {
      setError('Missing required data for claiming');
      return;
    }

    setClaiming(true);
    setError(null);
    setTxHash(null);

    try {
      const result = await verifyAndClaim(publicKey, address, signature, contractAddress, signer);

      if (result.success) {
        setTxHash(result.txHash || null);
        // Refresh claimable amount after successful claim
        await fetchClaimableAmount();
      } else {
        setError(result.error || 'Claim failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Claim failed');
      } else {
        setError('Claim failed');
      }
    } finally {
      setClaiming(false);
    }

  };

  // Auto-refresh claimable amount every 30 seconds
  useEffect(() => {
    if (claimData && address) {
      const interval = setInterval(fetchClaimableAmount, 30000);
      return () => clearInterval(interval);
    }
  }, [claimData, address]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Token Vesting Claim</h2>

      {/* Verification Section */}
      {!claimData && (
        <div className="mb-6">
          <button
            onClick={handleVerify}
            disabled={loading || !publicKey || !address || !signature}
            className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Verifying...' : 'Verify Eligibility'}
          </button>
        </div>
      )}

      {/* Claimable Amount Display */}
      {claimableInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Vesting Information</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Available to Claim:</span>
              <span className="font-bold text-green-600">
                {parseFloat(claimableInfo.claimableNow).toFixed(4)} tokens
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Total Claimed:</span>
              <span className="font-medium">
                {parseFloat(claimableInfo.totalClaimed).toFixed(4)} tokens
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Total Available:</span>
              <span className="font-medium">
                {parseFloat(claimableInfo.totalAvailable).toFixed(4)} tokens
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Claiming Progress</span>
              <span>
                {((parseFloat(claimableInfo.totalClaimed) / parseFloat(claimableInfo.totalAvailable)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(parseFloat(claimableInfo.totalClaimed) / parseFloat(claimableInfo.totalAvailable)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Button */}
      {claimableInfo && parseFloat(claimableInfo.claimableNow) > 0 && (
        <div className="mb-6">
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {claiming ? 'Claiming...' : `Claim ${parseFloat(claimableInfo.claimableNow).toFixed(4)} Tokens`}
          </button>
        </div>
      )}

      {/* Refresh Button */}
      {claimData && (
        <div className="mb-4">
          <button
            onClick={fetchClaimableAmount}
            disabled={loading}
            className="w-full bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-1 px-4 rounded text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh Claimable Amount'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {txHash && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="text-sm font-semibold">Claim Successful!</p>
          <p className="text-xs mt-1">
            Transaction: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 10)}
          </p>
        </div>
      )}

      {/* No Claimable Amount */}
      {claimableInfo && parseFloat(claimableInfo.claimableNow) === 0 && (
        <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="text-sm">No tokens available to claim at this time.</p>
        </div>
      )}
    </div>
  );
};

export default VestingClaimComponent;