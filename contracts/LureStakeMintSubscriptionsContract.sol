// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LureStakeMintSubscriptionsContract {

    address public owner;

    enum Boost { HandSolo, BulletTime, AlienAscending, ThePurge }

    struct UnitInfo {
        uint256 priceWei;        // price per unit in wei
        uint256 durationSeconds; // for time-based boosts: seconds per unit; ignored for ThePurge
    }

    struct PlayerSubs {
        uint256 handSoloExpiry;
        uint256 bulletTimeExpiry;
        uint256 alienAscendingExpiry;
        uint256 purgeCount; // number of ThePurge pieces owned
    }

    mapping(Boost => UnitInfo) public unitInfo;
    mapping(address => PlayerSubs) private players;

    event UnitInfoUpdated(Boost indexed boost, uint256 priceWei, uint256 durationSeconds);
    event Subscribed(address indexed player, Boost indexed boost, uint256 units, uint256 start, uint256 newExpiry);
    event PurgePurchased(address indexed player, uint256 units, uint256 newCount);
    event PurgeConsumed(address indexed player, address indexed consumer, uint256 remainingCount);
    event Withdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {

        owner = msg.sender;
        unitInfo[Boost.HandSolo] = UnitInfo({ priceWei: 0.01 ether, durationSeconds: 1 days });
        unitInfo[Boost.BulletTime] = UnitInfo({ priceWei: 0.02 ether, durationSeconds: 12 hours });
        unitInfo[Boost.AlienAscending] = UnitInfo({ priceWei: 0.05 ether, durationSeconds: 7 days });
        unitInfo[Boost.ThePurge] = UnitInfo({ priceWei: 0.005 ether, durationSeconds: 0 }); // duration unused

    }

    function setUnitInfo(Boost boost, uint256 priceWei, uint256 durationSeconds) external onlyOwner {

        require(priceWei > 0, "price must be > 0");
        unitInfo[boost] = UnitInfo({ priceWei: priceWei, durationSeconds: durationSeconds });
        emit UnitInfoUpdated(boost, priceWei, durationSeconds);

    }

    function buy(Boost boost) external payable {

        _buyFor(msg.sender, boost);

    }

    function buyFor(address player, Boost boost) external payable {

        require(player != address(0), "invalid player");
        _buyFor(player, boost);

    }

    function _buyFor(address player, Boost boost) internal {

        UnitInfo memory info = unitInfo[boost];
        require(info.priceWei > 0, "unit price not set");

        uint256 units = msg.value / info.priceWei;
        require(units > 0, "insufficient payment for one unit");

        PlayerSubs storage ps = players[player];

        if (boost == Boost.ThePurge) {

            ps.purgeCount += units;
            emit PurgePurchased(player, units, ps.purgeCount);
            return;

        }

        uint256 start;
        uint256 currentTime = block.timestamp;
        uint256 existingExpiry = _getExpiry(ps, boost);

        if (existingExpiry > currentTime) {
            start = existingExpiry;
        } else {
            start = currentTime + 1;
        }

        uint256 addedSeconds = units * info.durationSeconds;
        uint256 newExpiry = start + addedSeconds;

        _setExpiry(ps, boost, newExpiry);

        emit Subscribed(player, boost, units, start, newExpiry);
    }

    function consumePurge(address player, address consumer) external {

        require(player != address(0), "invalid player");
        PlayerSubs storage ps = players[player];
        require(ps.purgeCount > 0, "no purge pieces available");
        ps.purgeCount -= 1;
        emit PurgeConsumed(player, consumer, ps.purgeCount);

    }

    function getUnitInfo(Boost boost) external view returns (uint256 priceWei, uint256 durationSeconds) {

        UnitInfo memory info = unitInfo[boost];
        return (info.priceWei, info.durationSeconds);

    }

    function getPlayerSubscriptions(address player) external view returns (
        uint256 handSoloExpiry,
        uint256 bulletTimeExpiry,
        uint256 alienAscendingExpiry,
        uint256 purgeCount
    ) {

        PlayerSubs memory ps = players[player];
        return (ps.handSoloExpiry, ps.bulletTimeExpiry, ps.alienAscendingExpiry, ps.purgeCount);

    }

    function isBoostActive(address player, Boost boost) external view returns (bool) {

        uint256 expiry = _getExpiry(players[player], boost);
        return expiry > block.timestamp;

    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {

        require(to != address(0), "invalid address");
        require(amount <= address(this).balance, "insufficient balance");
        to.transfer(amount);
        emit Withdraw(to, amount);

    }

    function _getExpiry(PlayerSubs memory ps, Boost boost) internal pure returns (uint256) {

        if (boost == Boost.HandSolo) return ps.handSoloExpiry;
        if (boost == Boost.BulletTime) return ps.bulletTimeExpiry;
        if (boost == Boost.AlienAscending) return ps.alienAscendingExpiry;
        return 0;

    }

    function _setExpiry(PlayerSubs storage ps, Boost boost, uint256 expiry) internal {

        if (boost == Boost.HandSolo) ps.handSoloExpiry = expiry;
        else if (boost == Boost.BulletTime) ps.bulletTimeExpiry = expiry;
        else if (boost == Boost.AlienAscending) ps.alienAscendingExpiry = expiry;

    }

    receive() external payable {}
    fallback() external payable {}

}
