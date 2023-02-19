// App.js

import React, { useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "react-query";
import Web3Modal from "web3modal";
import { FilecoinNumber } from "@glif/filecoin-number";

import SupplyChain from "./contracts/SupplyChain.json";

import "./App.css";

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();

  const { data: account } = useQuery("account", async () => {
    if (!provider) return;
    const accounts = await provider.listAccounts();
    return accounts[0];
  });

  const connectWallet = async () => {
    const providerOptions = {};
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
    const newProvider = await web3Modal.connect();
    const newSigner = newProvider.getSigner();
    setProvider(newProvider);
    setSigner(newSigner);
    const newContract = new Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      SupplyChain.abi,
      newSigner
    );
    setContract(newContract);
  };

  const handleCreate = async () => {
    const amount = new FilecoinNumber(document.getElementById("amount").value, "fil");
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    await contract.createProduct(name, description, amount.toAttoFil());
  };

  return (
    <div className="App">
      <header>
        <h1>Supply Chain DApp</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
      <main>
        <h2>Create Product</h2>
        <form onSubmit={handleCreate}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description"></textarea>
          <label htmlFor="amount">Price (FIL):</label>
          <input type="text" id="amount" name="amount" />
          <button type="submit">Create</button>
        </form>
      </main>
    </div>
  );
}
