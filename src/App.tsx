import React, { useState } from 'react';
// import Onboard from '@web3-onboard/core'
import { init, useConnectWallet } from '@web3-onboard/react'
import walletConnectModule, { /* WalletConnectOptions */ } from "@web3-onboard/walletconnect";
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import './App.css';
import config from './config.json';

const walletConnectOptions/*: WalletConnectOptions*/ = {
  projectId:
    (config.WALLET_CONNECT_PROJECT_ID as string) ||
    "default-project-id",
  dappUrl: "http://localhost:3000/", // TODO
};
 
const blockNativeApiKey = config.BLOCKNATIVE_KEY as string;

const onBoardExploreUrl =
  (config.BLOCKNATIVE_KEY as string) ||
  "http://localhost:3000/"; // TODO

const walletConnect = walletConnectModule(walletConnectOptions);
const injected = injectedModule()
const wallets = [injected, walletConnect]

const chains = [
  {
    id: 1,
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${config.INFURA_ID}`,
  },
];

const appMetadata = {
  name: 'Example Identity App',
  icon: '/logo.svg',
  logo: '/logo.svg',
  description: 'Example app providing personhood on DFINITY Internet Computer',
  explore: onBoardExploreUrl,
  recommendedInjectedWallets: [
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    { name: 'MetaMask', url: 'https://metamask.io' }
  ],
};

const accountCenter = {
  desktop: {
    enabled: true,
  },
  mobile: {
    enabled: true,
    minimal: true,
  },
};

const onboard = init({
  appMetadata,
  apiKey: blockNativeApiKey,
  wallets,
  chains,
  accountCenter,
});

// UI actions:
// - connect: ask for signature, store the signature, try to retrieve, show retrieval status
// - recalculate: recalculate, show retrieval status
function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  async function readScore() {
    if (!wallet) {
      await connect();
    }
    const provider = new ethers.BrowserProvider(wallet!.provider, 'any');
    console.log('provider', provider);
    const signer = await provider.getSigner();
    console.log('signer', signer);
    const address = await signer.getAddress()
    console.log('address', address);
    const message = "I certify that I am the owner of the Ethereum account\n" + address;
    const signature = await signer.signMessage(message);
  }

  return (
    <div className="App">
      <h1>Example Bug Demonstration App</h1>
      <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : readScore())}>
        {connecting ? 'connecting' : wallet ? 'Disconnect Ethereum' : 'Connect Ethereum'}
      </button>
    </div>
  );
}

export default App;
