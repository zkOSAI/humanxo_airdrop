"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";


import styles from "../page.module.css";
import { useUsers } from "../queries/useUsers";

import { RedWalletOptions } from '../component/RedWalletOptions';
import { WhiteWalletOptions } from '../component/WhiteWalletOptions';

import {

    Dots,
    Face,
    Home,

    Star,


} from "@/shared/icons";
import { useMobileMenu } from "../context/mobileContext";
import { useAccount } from "wagmi";
//import ConnectWallet from "./component/redWallet";


export default function HomePage() {
    const { publicKey, disconnect, connected, connecting, signMessage } = useWallet();

    const { setVisible } = useWalletModal();

    // const [connectedWallet, setConnectedWallet] = React.useState(false);
    const { setMobileMenu } = useMobileMenu();
    const { isConnected, address } = useAccount();

    const data = useUsers();
    const navigateToExtensionPage = () => {
        window.open(`https://github.com/zkOSAI/HumanXO-Extension`, "_blank");
    };

    const signEthAddress = async () => {
        if (address && signMessage) { // Check if signMessage exists
            const message = address;
            if (!message) {
                console.error("Address is undefined");
                return;
            }

            try {
                const messageBytes = new TextEncoder().encode(message);
                const signature = await signMessage(messageBytes);
                const signatureBase58 = btoa(String.fromCharCode(...signature));
                console.log("🚀 ~ signEthAddress ~ signatureBase58:", signatureBase58);
            } catch (error) {
                console.error("Error signing message:", error);
            }
        } else {
            if (!address) {
                console.error("Address is not available");
            }
            if (!signMessage) {
                console.error("This wallet does not support message signing");
            }
        }
    }

    React.useEffect(() => {
        if (connected && publicKey) {
            signEthAddress();

        }
    }, [connected, publicKey]);

    React.useEffect(() => {
        const checkConnection = async () => {
            try {
                // @ts-expect-error: third-party type issue
                const provider = window.phantom?.solana;
                if (provider?.isPhantom) {
                    //const connected = provider.isConnected;
                    //setConnected(connected);
                }
            } catch (error) {
                console.error("Error checking connection:", error);
            }
        };

        checkConnection();

    }, []);

    const connectPhantomWallet = async () => {
        console.log("connection wallet");
        setVisible(true);

    };

    const disconnectWallet = async () => {
        disconnect();
    };

    return (
        <>
            <div className={styles.contentArea}>
                <div className={styles.contentAreaWrapper}>
                    <div className={styles.contentAreaTop}>

                        <RedWalletOptions />
                    </div>

                    {isConnected ? (
                        <div className={styles.dashboard}>
                            <div className={styles.dashboardInfo}>
                                <div className={styles.dashboardInfoCircle}></div>

                                <p className={styles.dashboardInfoBread}>

                                    Airdrop
                                </p>

                                <p className={styles.dashboardInfoBalance}>
                                    {data?.airdropable} points
                                </p>

                                <button
                                    className={cn(styles.button, styles.dashboardInfoClaim)}
                                    onClick={() => alert("airdrop")}
                                >
                                    airdrop
                                </button>

                                {connected ? (
                                    <button
                                        className={cn(styles.button, styles.welcomeBlockConnect)}
                                        onClick={disconnectWallet}
                                    >
                                        Disonnect solana Wallet
                                    </button>
                                ) : (
                                    <button
                                        className={cn(styles.button, styles.welcomeBlockConnect)}
                                        onClick={connectPhantomWallet}
                                        disabled={connecting}
                                    >
                                        {connecting ? "Connecting..." : "Connect Solana Wallet"}
                                    </button>
                                )}
                                <p className={styles.dashboardInfoEarned}>
                                    already airdroped
                                </p>

                                <p className={styles.dashboardInfoValue}>
                                    {data?.airdroped} Points
                                </p>
                            </div>


                        </div>
                    ) : (
                        <div className={styles.welcome}>
                            <div className={styles.welcomeBlock}>
                                <div className={styles.welcomeCircle}></div>

                                <div className={styles.welcomeBlockContent}>
                                    <div className={styles.welcomeBlockTitleInner}>
                                        <p>Welcome to</p>

                                        <p>HumanXO by zkOS.</p>
                                    </div>

                                    <p className={styles.welcomeBlockText}>
                                        Connect and start improving your on-chain reputation:
                                    </p>

                                    <p className={styles.welcomeBlockText}>
                                        By engaging with HumanXO, users strengthen their on-chain
                                        identity, unlock rewards and contribute to a more
                                        Sybil-resistant blockchain.
                                    </p>
                                    <WhiteWalletOptions />
                                </div>
                            </div>

                            <div className={styles.welcomeWrapper}>
                                <div className={styles.welcomeSolana}>
                                    <div className={styles.welcomeSolanaImg}>
                                        <Image src="/img/solana.png" alt="Solana" fill />
                                    </div>

                                    <div className={styles.welcomeSolanaText}>
                                        <p>Built on Solana,</p>

                                        <p>designed to increase</p>

                                        <p>on-chain human activity.</p>
                                    </div>
                                </div>

                                <div className={styles.welcomeExtension}>
                                    <Face className={styles.welcomeExtensionIcon} />

                                    <p className={styles.welcomeExtensionText}>
                                        Passively verify you&rsquo;re human, build reputation in the
                                        HumanXO ecosystem, and earn rewards.
                                    </p>

                                    <button
                                        className={cn(styles.button, styles.downloadExtension)}
                                        onClick={navigateToExtensionPage}
                                    >
                                        Download Browser Extension
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.mobileMenu}>
                <Link href="/" className={styles.mobileMenuLogo}>
                    <Image src="/img/logo.png" alt="logo" fill />
                </Link>

                <Link href="/" className={styles.mobileMenuLink}>
                    <Home />
                    Dashboard
                </Link>

                <Link href="/" className={styles.mobileMenuLink}>
                    <Star />
                    Reputation
                </Link>

                <button
                    className={cn(styles.button, styles.mobileMenuButton)}
                    onClick={() => setMobileMenu(true)}
                >
                    <Dots />
                    More
                </button>
            </div>
        </>
    );
}
