"use client";

import React from "react";
import cn from "classnames";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import styles from "./page.module.css";

import { WhiteWalletOptions } from './component/WhiteWalletOptions';

import { useAccount, useWalletClient } from "wagmi";
import { useSignature } from "./context/signContext";
import { useAirdrop } from "./context/airdropContext";
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { ClaimableAmountInfo } from "./api/verifySolana";
import CountdownTimer from "./component/timer";

//import ConnectWallet from "./component/redWallet";

function useEthersSigner() {
  const { data: walletClient } = useWalletClient();

  return React.useMemo(() => {
    if (!walletClient) return null;

    const provider = new BrowserProvider(walletClient.transport);
    return provider.getSigner();
  }, [walletClient]);
}

export default function HomePage() {
  const {  connected, connecting, signMessage } = useWallet();
  const { setVisible } = useWalletModal();

  // const [connectedWallet, setConnectedWallet] = React.useState(false);
  //const { setMobileMenu } = useMobileMenu();
  const { isConnected, address } = useAccount();

  // const data = useUsers();
  const {  setSignature } = useSignature();

  const { airdrop } = useAirdrop();
  //const { publicKey } = useWallet();
  const [ ethersigner, setEthersSigner] = React.useState<JsonRpcSigner | null>(null);
  const signer = useEthersSigner();

  // 🎯 ADD STATE FOR CLAIM INFO
  const [claimInfo, setClaimInfo] = React.useState<ClaimableAmountInfo | null>(null);

  // 🎯 CALLBACK FUNCTION TO RECEIVE CLAIM INFO
  const handleClaimInfoUpdate = (info: ClaimableAmountInfo) => {
    console.log('📊 Claim info received at HomePage:', info);
    setClaimInfo(info);
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
        setSignature(signature);
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
    if (signer) {
      signer.then(setEthersSigner).catch(console.error);
      console.log(ethersigner);
    
    } else {
      setEthersSigner(null);
    }
  }, [signer]);

  React.useEffect(() => {
    if (isConnected && address) {
      signEthAddress();
    }
  }, [isConnected, address]);

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

  // const disconnectWallet = async () => {
  //   disconnect();
  // };

  return (
    <>
      <div className={styles.contentArea}>
        {connected ? (
          <div className={cn(styles.contentAreaWrapper)}>
            <div className={styles.dashboard}>
              {/* <div className={styles.dashboardInfo}></div> */}
              {/* <button
                className={cn(styles.button, styles.welcomeBlockConnect)}
                onClick={disconnectWallet}
              >
                Disonnect solana Wallet
              </button> */}
              <div className={styles.welcome}>
                <div className={styles.welcomeBlock}>
                  <div className={styles.welcomeBlockContent}>
                    <div className={styles.welcomeBlockTitleInner}>
                      <p>Congratulation, you&apos;re eligible</p>
                      <p>for ZKOS Ethereum airdrop</p>
                    </div>

                    <p className={styles.welcomeBlockText}>
                      <b className={styles.welcomeBlockText}> {airdrop}</b> ZKOS
                    </p>

                    {/* 🎯 DISPLAY CLAIM INFO HERE */}
                    {claimInfo && (
                      <div className={styles.welcomeBlockText}>
                        <h3>Airdrop Information</h3>
                        <p><strong>Airdropable Now:</strong> {claimInfo.claimableNow} ZKOS</p>
                        <p><strong>Total Airdroped:</strong> {claimInfo.totalClaimed} ZKOS</p>
                        <p><strong>Total Available:</strong> {claimInfo.totalAvailable} ZKOS</p>
                      </div>
                    )}

               
                    
                    {/* 🎯 PASS THE CALLBACK TO WhiteWalletOptions */}
                    <WhiteWalletOptions onClaimInfoUpdate={handleClaimInfoUpdate} />
                  </div>
                </div>

                <div className={styles.welcomeExtension}>
                  <p className={styles.welcomeExtensionText}>
                    Next claim will be available soon.
                  </p>
                  <p className={styles.welcomeExtensionText}>
                    <b>{claimInfo?.claimableNow || airdrop}</b> ZKOS
                  </p>

                  <button
                    className={cn(styles.button, styles.downloadExtension)}
                  >
                   <CountdownTimer/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.contentAreaWrapper}>
            <div className={styles.dashboardBig}>
              <div className={styles.dashboardInfo}>
                <p className={styles.dashboardInfoBread}>
                  Welcmoe to
                </p>

                <p className={styles.dashboardInfoBalance}>
                  zkOS Airdrop
                </p>
                <p className={styles.dashboardInfoEarned}>
                  Connect your wallet to see if you&rsquo;re <br />
                  eligible for the ZKOS Ethereum airdrop
                </p>

                <button
                  className={cn(styles.button, styles.welcomeBlockConnect)}
                  onClick={connectPhantomWallet}
                  disabled={connecting}
                >
                  {connecting ? "Connecting..." : "Connect Solana Wallet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}