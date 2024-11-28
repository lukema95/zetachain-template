"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectBitcoin } from "@zetachain/universalkit";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import "@solana/wallet-adapter-react-ui/styles.css";
// import local packages
import { ZetaChainClient } from "../../../../toolkit/packages/client/src";
import { useWallet } from '@solana/wallet-adapter-react';

const Page = () => {
  const wallet = useWallet();
  const client = new ZetaChainClient({
    network: "devnet", 
    solanaAdapter: wallet as any,
  });

  const [amount, setAmount] = useState("0.1");
  const [recipient, setRecipient] = useState("0x1b02C3079c039DF9E20DC68427cb87bf821BffeF");
  const [paramTypes, setParamTypes] = useState<string[]>(["address", "bytes", "bool"]);
  const [paramValues, setParamValues] = useState<string[]>(["", "", ""]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await client.solanaDeposit({
        amount: Number(amount),
        recipient: recipient,
        params: [paramTypes, paramValues],
      });
      console.log("Transaction sent:", result);
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return ( 
    <div className="m-4">
      <div className="flex justify-end gap-2 mb-10">
        <ConnectBitcoin />
        <ConnectButton label="Connect EVM" showBalance={false} />
        <WalletMultiButton />
      </div>
      <div>
        <form className="flex flex-col gap-4 max-w-md" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded"
              placeholder="Please enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parameters</label>
            <div className="space-y-2">
              {paramTypes.map((type, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="w-1/3 p-2 border rounded bg-balck"
                    value={type}
                    disabled
                  />
                  <input
                    type="text"
                    className="w-2/3 p-2 border rounded"
                    placeholder={`Enter ${type} value`}
                    value={paramValues[index]}
                    onChange={(e) => {
                      const newValues = [...paramValues];
                      newValues[index] = e.target.value;
                      setParamValues(newValues);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Recipient Address</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Please enter the recipient address"
              value={recipient}
              defaultValue={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
