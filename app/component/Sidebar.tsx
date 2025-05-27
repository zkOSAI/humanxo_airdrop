"use client"
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import styles from "../page.module.css"
import {
    Cross,
    Dots,
    
    Home,
    
    Moon,
    Star,
    Stats,
    Sun,
} from "@/shared/icons";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "../context/mobileContext";
import { useTheme } from "../context/themeContext";
import { MobileWalletOptions } from "./MobileWalletOptions";

export default function Sidebar() {
    const pathname = usePathname();

    const { mobileMenu, setMobileMenu } = useMobileMenu();
    const {theme, setTheme} = useTheme();
    return (
        <div
            className={cn(styles.sidebar, {
                [styles.active]: mobileMenu,
            })}
        >
            <div className={styles.sidebarTop}>
                <div className={styles.sidebarLogoInner}>
                    <Link
                        href="/"
                        className={styles.sidebarLogo}
                        onClick={() => setMobileMenu(false)}
                    >
                        <div className="imageDiv">
                            <Image
                                className="imageDiv1"
                                src="/img/logo.png"
                                alt="logo"
                                fill
                            />
                        </div>
                    </Link>

                    <button
                        className={cn(styles.button, styles.sidebarClose)}
                        onClick={() => setMobileMenu(false)}
                    >
                        <Cross />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link
                        href="/"
                        className={cn(
                            styles.sidebarNavLink,
                            pathname === "/" && styles.active
                        )}
                        onClick={() => setMobileMenu(false)}
                    >
                        <Home />
                        Dashboard
                    </Link>
                    {/* <Link
                        href="/airdrop"
                        className={cn(
                            styles.sidebarNavLink,
                            pathname === "/airdrop" && styles.active
                        )}
                        onClick={() => setMobileMenu(false)}
                    >
                        <Stats />
                        airdrop 
                    </Link> */}

                    <Link
                        href="/reputation"
                        className={cn(
                            styles.sidebarNavLink,
                            pathname === "/reputation" && styles.active
                        )}
                        onClick={() => setMobileMenu(false)}
                    >
                        <Star />
                        Reputation (SOON)
                    </Link>

                    <Link
                        href="/statistics"
                        className={cn(
                            styles.sidebarNavLink,
                            pathname === "/statistics" && styles.active
                        )}
                        onClick={() => setMobileMenu(false)}
                    >
                        <Stats />
                        Statistics (SOON)
                    </Link>
                    
                </nav>
            </div>

            <div className={styles.sidebarBottom}>
                <div className={styles.sidebarBottomTheme}>
                    <button
                        className={cn(styles.button, styles.sidebarThemeItem, {
                            [styles.active]: theme === "dark",
                        })}
                        onClick={() => setTheme("dark")}
                    >
                        <Moon />
                    </button>

                    <button
                        className={cn(styles.button, styles.sidebarThemeItem, {
                            [styles.active]: theme === "light",
                        })}
                        onClick={() => setTheme("light")}
                    >
                        <Sun />
                    </button>
                </div>

                <button className={cn(styles.button, styles.sidebarBottomMore)}>
                    <Dots />
                </button>

                <MobileWalletOptions />
            </div>
        </div>

    )
}