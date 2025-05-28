'use client';

import * as React from 'react';
import { Connector, useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import styles from "../page.module.css";
import cn from "classnames";
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useSignature } from '../context/signContext';
import { verifyAndClaim } from '../api/verifySolana';
// Remove Solana wallet import if you're only using Ethereum
import { useWallet } from '@solana/wallet-adapter-react';
import { useAirdrop } from '../context/airdropContext';

// Custom hook to convert wagmi wallet client to ethers signer
function useEthersSigner() {
    const { data: walletClient } = useWalletClient();

    return React.useMemo(() => {
        if (!walletClient) return null;

        const provider = new BrowserProvider(walletClient.transport);
        return provider.getSigner();
    }, [walletClient]);
}


export function WhiteWalletOptions() {
    const { connectors, connect, status } = useConnect();
    const { isConnected, address } = useAccount();
    const { signature, setSignature } = useSignature();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    const { data: walletClient } = useWalletClient();
    const [ethersSigner, setEthersSigner] = React.useState<JsonRpcSigner | null>(null);
    // If you need Solana functionality, handle it separately
    const { publicKey, signMessage } = useWallet();
    const { airdrop, setAirdrop } = useAirdrop();
    const signer = useEthersSigner();
    // Convert the promise-based signer to state
    React.useEffect(() => {
        if (signer) {
            signer.then(setEthersSigner).catch(console.error);
        } else {
            setEthersSigner(null);
        }
    }, [signer]);
   React.useEffect(() => {
  if (signature && address && publicKey && ethersSigner) {
    (async () => {
      const result = await verifyAndClaim(publicKey, address, signature, contractAddress, ethersSigner);
      if (result.success && result.amount) {
        console.log("🚀 ~ result.amount:", result.amount)
        console.log(result.amount);
        setAirdrop(result.amount); // 💥 Save the amount claimed to context
      } else {
        console.error("Claim failed:", result.error);
      }
    })();
  }
}, [signature, address, publicKey, ethersSigner]);
    if (isConnected) {
        return (
            <>
                <button
                    className={cn(styles.button, styles.welcomeBlockConnect)}
                    onClick={() => {
                        signEthAddress(address, setSignature, signMessage);
                        // setTimeout(() => {
                        //     verifySolana(publicKey, address, signature);
                        // }, 1000)
                    }}
                >
                    Claim With Ethereum Wallet
                </button>
            </>
        );
    }

    return (
        <>
            <WalletOption
                key={connectors[0].uid}
                connector={connectors[0]}
                onClick={() => connect({ connector: connectors[0] })}
                isConnecting={status === 'pending'}
            />
        </>
    );
}

function WalletOption({
    connector,
    onClick,
    isConnecting,
}: {
    connector: Connector;
    onClick: () => void;
    isConnecting: boolean;
}) {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        })();
    }, [connector]);

    return (
        <button
            className={cn(styles.button, styles.welcomeBlockConnect)}
            disabled={!ready || isConnecting}
            onClick={onClick}
        >
            {isConnecting ? 'Connecting...' : `Connect Ether Wallet`}
        </button>
    );
}

const signEthAddress = async (
    address: `0x${string}` | undefined,
    setSignature: (signature: any) => void,
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined
) => {
    if (!address) {
        console.error("Address is not available");
        return;
    }
    const message = address;
    // For Ethereum wallets, you need to use the wagmi signing methods
    // This is just a placeholder - you'll need to implement proper Ethereum message signing
    try {
        // Use wagmi's useSignMessage hook instead
        console.log("Signing address:", address);
        const messageBytes = new TextEncoder().encode(message);
        if (signMessage) {
            const signature = await signMessage(messageBytes);
            setSignature(signature)
        }

    } catch (error) {
        console.error("Error signing message:", error);
    }
}