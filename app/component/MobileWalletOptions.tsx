'use client';

import * as React from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import styles from "../page.module.css";
import cn from "classnames";



export function MobileWalletOptions() {
    const { connectors, connect, status } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected } = useAccount();

    if (isConnected) {
        return (
            <>

                <button className={cn(styles.button, styles.sidebarMobileButton)} onClick={() => disconnect()}>Disconnect Wallet</button>
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
        <button className={cn(styles.button, styles.sidebarMobileButton)} disabled={!ready || isConnecting} onClick={onClick}>
            {isConnecting ? 'Connecting...' : `Connect MetaMask`}
        </button>
    );
}
