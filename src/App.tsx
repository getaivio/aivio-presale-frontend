// src/App.tsx
import { useEffect, useState } from "react";
import "./index.css";

const App = () => {
  const [wallet, setWallet] = useState("");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPresale = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/presale`);
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchPresale();
  }, []);

  const submitWallet = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet }),
      });
      alert("Wallet submitted!");
    } catch (err) {
      alert("Failed to submit");
    }
  };

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedWallet(accounts[0]);
      } catch (err) {
        console.error("User rejected wallet connection");
      }
    } else {
      alert("MetaMask not found!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto text-center">
        <img
          src="/token-icon.svg"
          alt="Aivio Token Icon"
          className="mx-auto w-24 mb-6 animate-pulse"
        />
        <h1 className="text-4xl font-bold mb-4">AIVIO TOKEN IS LIVE</h1>

        <ul className="text-left mb-4">
          <li>✅ 1 Billion AIV tokens pre-mined</li>
          <li>✅ Airdrop & Pre-sale now open</li>
          <li>✅ Secure & decentralized</li>
        </ul>

        {loading ? (
          <p className="text-gray-400">Loading presale data…</p>
        ) : error ? (
          <p className="text-red-400">Failed to load presale data</p>
        ) : (
          <div className="space-y-2 mb-4">
            <p><strong>Total Supply:</strong> {data.totalSupply || "1B AIV"}</p>
            <p><strong>Presale Price:</strong> {data.price || "N/A"}</p>
            <p><strong>Remaining:</strong> {data.remaining || "N/A"}</p>
          </div>
        )}

        <button
          onClick={connectWallet}
          className="bg-yellow-500 text-black font-bold px-4 py-2 rounded mb-4"
        >
          {connectedWallet ? `Connected: ${connectedWallet}` : "Connect Wallet"}
        </button>

        <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Enter your wallet address"
            className="bg-gray-800 text-white p-2 rounded border border-gray-600"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
          <button
            onClick={submitWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>

        <a
          href="https://getaivio.com/whitepaper"
          className="text-blue-400 mt-6 inline-block underline"
        >
          View Aivio Whitepaper
        </a>
      </div>
    </main>
  );
};

export default App;
