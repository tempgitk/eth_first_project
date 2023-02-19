// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFilecoinService {
    function store(string calldata _cid, string calldata _data)
        external
        returns (bool);

    function retrieve(string calldata _cid) external returns (string memory);
}
