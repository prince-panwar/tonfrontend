
"use client";
"use client";
// components/TonContractUI.tsx

import React, { useState, useEffect } from 'react';
import { useTonAddress, TonConnectButton } from '@tonconnect/ui-react';

const TonContractUI: React.FC = () => {
  const [counterValue, setCounterValue] = useState<number>(0);
  const [recentSender, setRecentSender] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  const userFriendlyAddress = useTonAddress();

  // Fetch data when the user is connected
  useEffect(() => {
    if (userFriendlyAddress) {
      // Fetch data from the smart contract here
      // For demonstration, we'll set some dummy data
      setCounterValue(42);
      setRecentSender('0:abcdef...');
      setBalance(1000);
    }
  }, [userFriendlyAddress]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {!userFriendlyAddress ? (
        // Show the welcome message and TonConnectButton
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Welcome to our DApp
          </h1>
          <p className="text-gray-700 mb-6">Please connect your wallet to continue.</p>
          <TonConnectButton />
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="w-full bg-white shadow-sm p-3">
            <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="text-gray-700">
                  <span className="font-medium">Counter Value:</span> {counterValue}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Balance:</span> {balance} TON
                </div>
              </div>
              <div className="mt-1 sm:mt-0 text-gray-700">
                <span className="font-medium">Connected Address:</span> {userFriendlyAddress}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow w-full flex flex-col items-center px-4 py-6">
            <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              TON Smart Contract Interface
            </h1>

            {/* Actions Card */}
            <div className="bg-white shadow-sm rounded-md p-6 w-full max-w-md animate-fade-in">
              {/* Deposit Section */}
              <div className="flex flex-col mb-6">
                <label className="text-gray-600 mb-1 text-sm">Deposit Amount</label>
                <div className="flex">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    placeholder="Enter amount"
                  />
                  <button className="px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-r-md hover:opacity-90 transition duration-200 text-sm">
                    Deposit
                  </button>
                </div>
              </div>

              {/* Withdraw Section */}
              <div className="flex flex-col mb-6">
                <label className="text-gray-600 mb-1 text-sm">Withdraw Amount</label>
                <div className="flex">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    placeholder="Enter amount"
                  />
                  <button className="px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-r-md hover:opacity-90 transition duration-200 text-sm">
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Increment Counter */}
              <div className="flex justify-center">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md hover:opacity-90 transition duration-200 transform hover:scale-105 text-sm">
                  Increment Counter
                </button>
              </div>
            </div>
          </main>

          {/* Footer (Optional) */}
          <footer className="w-full bg-white p-3 text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TON DApp Interface
          </footer>
        </>
      )}
    </div>
  );
};

export default TonContractUI;
