const { LotusRPC } = require('@filecoin-shipyard/lotus-client-rpc');
const { NodejsProvider: Provider } = require('@filecoin-shipyard/lotus-client-provider-nodejs');
const { testnet } = require('@filecoin-shipyard/lotus-client-schema');
const fs = require('fs');

const endpoint = 'ws://lotus.testground.ipfs.team:1234/rpc/v0';
const token = process.env.LOTUS_AUTH_TOKEN;

const provider = new Provider(endpoint, { token });
const client = new LotusRPC(provider, {token});
