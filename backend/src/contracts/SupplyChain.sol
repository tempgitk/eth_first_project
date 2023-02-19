// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum State {
        Created,
        InTransit,
        Delivered
    }

    struct Item {
        uint256 itemId;
        address owner;
        string itemName;
        string itemDescription;
        uint256 quantity;
        uint256 price;
        State state;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount = 0;

    event ItemCreated(uint256 indexed itemId, address indexed owner);
    event ItemInTransit(uint256 indexed itemId);
    event ItemDelivered(uint256 indexed itemId);

    function createItem(
        string calldata _itemName,
        string calldata _itemDescription,
        uint256 _quantity,
        uint256 _price
    ) public returns (uint256) {
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            msg.sender,
            _itemName,
            _itemDescription,
            _quantity,
            _price,
            State.Created
        );
        emit ItemCreated(itemCount, msg.sender);
        return itemCount;
    }

    function getItem(uint256 _itemId)
        public
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            State
        )
    {
        Item storage item = items[_itemId];
        return (
            item.itemId,
            item.owner,
            item.itemName,
            item.itemDescription,
            item.quantity,
            item.price,
            item.state
        );
    }

    function updateState(uint256 _itemId, uint8 _state) public {
        Item storage item = items[_itemId];
        if (_state == 1) {
            require(item.owner == msg.sender, "Only owner can update state");
            item.state = State.InTransit;
            emit ItemInTransit(_itemId);
        } else if (_state == 2) {
            require(item.owner == msg.sender, "Only owner can update state");
            item.state = State.Delivered;
            emit ItemDelivered(_itemId);
        }
    }
}
