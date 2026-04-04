// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LureStakeMintNFTContract is ERC721, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    enum Species { Mintling, Gasoid, Contracteur, Droppee, Vivido, Hidee,
                   Gamblet, Omno }

    struct AlienSet {
        Species[5] species;
        uint64 mintedAt;
        address ownerAtMint;
    }

    mapping(uint256 => AlienSet) private _sets;

    event Minted(address indexed minter, uint256 indexed tokenId, uint8[] speciesIndices, uint256 feePaid);

    error InvalidSpeciesIncluded(uint8 invalidIndex);
    error InvalidSpeciesCount(uint256 provided);
    error InsufficientFee(uint256 required, uint256 provided);

    uint256 private _mintFee; // in wei

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialMintFeeWei
    ) ERC721(name_, symbol_) {

        _mintFee = initialMintFeeWei;

    }

    function setMintFee(uint256 newFee) external onlyOwner {

        _mintFee = newFee;

    }

    function getMintFee() external view returns (uint256) {

        return _mintFee;

    }

    function mint(uint8[] calldata speciesIndices) external payable nonReentrant returns (uint256) {

        if (speciesIndices.length != 5) {
            revert InvalidSpeciesCount(speciesIndices.length);
        }
        uint256 required = _mintFee;
        if (msg.value < required) {
            revert InsufficientFee(required, msg.value);
        }
        for (uint256 i = 0; i < 5; i++) {
            uint8 idx = speciesIndices[i];
            require(idx <= uint8(Species.Omno), "Species index out of range");
            if (idx == uint8(Species.Gamblet) || idx == uint8(Species.Omno)) {
                revert InvalidSpeciesIncluded(idx);
            }
        }
        _tokenIdCounter.increment();
        uint256 newId = _tokenIdCounter.current();
        _safeMint(msg.sender, newId);
        Species[5] memory arr;
        for (uint256 i = 0; i < 5; i++) {
            arr[i] = Species(speciesIndices[i]);
        }
        _sets[newId] = AlienSet({
            species: arr,
            mintedAt: uint64(block.timestamp),
            ownerAtMint: msg.sender
        });
        uint8[] memory emitted = new uint8[](5);
        for (uint256 i = 0; i < 5; i++) {
            emitted[i] = speciesIndices[i];
        }
        emit Minted(msg.sender, newId, emitted, required);
        uint256 excess = msg.value - required;
        if (excess > 0) {
            (bool sent, ) = payable(msg.sender).call{value: excess}("");
            if (!sent) {
                // intentionally do nothing; excess remains in contract
            }
        }
        return newId;

    }

    function withdraw(address payable to) external onlyOwner nonReentrant {

        require(to != address(0), "Invalid recipient");
        uint256 bal = address(this).balance;
        require(bal > 0, "No funds");
        (bool sent, ) = to.call{value: bal}("");
        require(sent, "Withdraw failed");

    }

    function getSpeciesIndices(uint256 tokenId) external view returns (uint8[5] memory) {

        require(_exists(tokenId), "Query for nonexistent token");
        Species[5] storage s = _sets[tokenId].species;
        uint8[5] memory out;
        for (uint256 i = 0; i < 5; i++) {
            out[i] = uint8(s[i]);
        }
        return out;

    }

    function getSpeciesNames(uint256 tokenId) external view returns (string[5] memory) {

        require(_exists(tokenId), "Query for nonexistent token");
        Species[5] storage s = _sets[tokenId].species;
        string[5] memory out;
        for (uint256 i = 0; i < 5; i++) {
            out[i] = _speciesToString(s[i]);
        }
        return out;

    }

    function getMintMetadata(uint256 tokenId) external view returns (uint64 mintedAt, address ownerAtMint) {

        require(_exists(tokenId), "Query for nonexistent token");
        AlienSet storage s = _sets[tokenId];
        return (s.mintedAt, s.ownerAtMint);

    }

    function _speciesToString(Species s) internal pure returns (string memory) {

        if (s == Species.Mintling) return "Mintling";
        if (s == Species.Gasoid) return "Gasoid";
        if (s == Species.Contracteur) return "Contracteur";
        if (s == Species.Droppee) return "Droppee";
        if (s == Species.Vivido) return "Vivido";
        if (s == Species.Hidee) return "Hidee";
        if (s == Species.Gamblet) return "Gamblet";
        if (s == Species.Omno) return "Omno";
        return "Unknown";

    }

    function burn(uint256 tokenId) external onlyOwner {

        require(_exists(tokenId), "Burn nonexistent");
        _burn(tokenId);
        delete _sets[tokenId];

    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {

        super._beforeTokenTransfer(from, to, tokenId);

    }

    receive() external payable {}
    fallback() external payable {}

    uint256 private constant MAX_WORKING = 50; // safety cap for doubling growth

    function simulateTransformations(uint8[] calldata speciesIndices)
        external
        view
        returns (uint256[8] memory counts, uint8[] memory finalSpecies)
    {

        require(speciesIndices.length > 0, "Empty input");
        require(speciesIndices.length <= MAX_WORKING, "Input too large");
        uint8[] memory working = new uint8[](speciesIndices.length);
        for (uint256 i = 0; i < speciesIndices.length; i++) {
            require(speciesIndices[i] <= uint8(Species.Omno), "Species index out of range");
            working[i] = speciesIndices[i];
        }
        uint256 idx = 0;
        while (idx < working.length) {
            uint8 sp = working[idx];
            if (sp == uint8(Species.Gamblet)) {
                uint256 rnd = uint256(keccak256(abi.encodePacked(block.timestamp, block.number, idx, working.length, msg.sender))) % 100;
                if (rnd < 33) {
                    uint256 gCount = 0;
                    for (uint256 j = 0; j < working.length; j++) {
                        if (working[j] == uint8(Species.Gamblet)) {
                            gCount++;
                        }
                    }
                    require(gCount <= MAX_WORKING, "Gamblet result exceeds cap");
                    uint8[] memory newWorking = new uint8[](gCount);
                    for (uint256 j = 0; j < gCount; j++) {
                        newWorking[j] = uint8(Species.Gamblet);
                    }
                    working = newWorking;
                    idx = 0;
                    continue;
                } else if (rnd < 66) {
                    uint256 newLen = working.length * 2;
                    require(newLen <= MAX_WORKING, "Doubling would exceed cap");
                    uint8[] memory newWorking = new uint8[](newLen);
                    for (uint256 j = 0; j < working.length; j++) {
                        newWorking[j] = working[j];
                        newWorking[j + working.length] = working[j];
                    }
                    working = newWorking;
                } else {
                    // Outcome 3: do nothing
                    // nothing to change
                }
            }
            // Omno logic
            else if (sp == uint8(Species.Omno)) {
                uint256 pick = uint256(keccak256(abi.encodePacked(block.timestamp, block.number, idx, working.length, msg.sender, sp))) % 6;
                working[idx] = uint8(pick); // safe because pick in 0..5
            }
            idx++;
        }
        for (uint256 i = 0; i < working.length; i++) {
            uint8 s = working[i];
            counts[s] += 1;
        }
        finalSpecies = new uint8[](working.length);
        for (uint256 i = 0; i < working.length; i++) {
            finalSpecies[i] = working[i];
        }
        return (counts, finalSpecies);
    }

}
