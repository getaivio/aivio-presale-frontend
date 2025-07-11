import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';

const presaleAddress = "0xYourPresaleContractAddress";
const backendURL = "https://your-backend-url.onrender.com";

const Presale = () => {
  const [wallet, setWallet] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    checkWhitelist(address);
  };

  const checkWhitelist = async (address) => {
    try {
      const res = await axios.get(`${backendURL}/api/checkWhitelist/${address}`);
      setIsWhitelisted(res.data.whitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhitelist = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/whitelist`, { name, email, wallet });
      setStatus("Submitted for whitelist approval");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async () => {
    setStatus("Buying...");
    setStatus("Buy complete (simulate)");
    await axios.post(`${backendURL}/api/logPurchase`, {
      wallet,
      usdtAmount,
      aivReceived: usdtAmount * 1000,
      txHash: "0xSIMULATED",
      date: new Date(),
      status: "confirmed"
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AIVIO Presale</h2>
      <button onClick={connectWallet}>{wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Connect Wallet"}</button>
      {wallet && (
        isWhitelisted ? (
          <div>
            <h3>Buy AIV</h3>
            <input type="number" placeholder="Enter USDT" value={usdtAmount} onChange={(e) => setUsdtAmount(e.target.value)} />
            <button onClick={handleBuy}>Buy</button>
          </div>
        ) : (
          <form onSubmit={handleWhitelist}>
            <h3>Whitelist Application</h3>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
            <input value={wallet} readOnly /><br />
            <button type="submit">Join Whitelist</button>
          </form>
        )
      )}
      <p>{status}</p>
    </div>
  );
};

export default Presale;
