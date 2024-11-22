"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useChainId, useWalletClient } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { UniversalKitProvider } from "@zetachain/universalkit";
import { config } from "../wagmi";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const queryClient = new QueryClient();

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const rainbowKitTheme = theme === "dark" ? darkTheme() : lightTheme();

  return (
    <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
  );
};

const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <UniversalKitProvider config={config} client={queryClient}>
      {children}
    </UniversalKitProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <WagmiWrapper>
                  <ThemeProvider>{children}</ThemeProvider>
                </WagmiWrapper>
              </NextThemesProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
