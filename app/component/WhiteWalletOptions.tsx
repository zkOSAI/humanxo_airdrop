'use client';

import * as React from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import styles from "../page.module.css";
import cn from "classnames";
import { useSignature } from '../context/signContext';
import { verifySolana } from '../api/verifySolana';
// Remove Solana wallet import if you're only using Ethereum
import { useWallet } from '@solana/wallet-adapter-react';

export function WhiteWalletOptions() {
    const { connectors, connect, status } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, address } = useAccount();
    const { signature, setSignature } = useSignature();

    // If you need Solana functionality, handle it separately
    const { publicKey, signMessage } = useWallet();
    React.useEffect(() => {
        if (signature && address && publicKey) {
            verifySolana(publicKey, address, signature);
        }
    }, [signature, address, publicKey]);
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