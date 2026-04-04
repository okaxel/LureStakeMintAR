# LureStakeMintAR

**The most delightfully ridiculous AR hunt around.**

LureStakeMintAR is an AR game built for the ETHGLobal Cannes 2026. hackathon. In this game players hunt, collect, and mint alien pieces into NFTs. Built with **A-Frame JS** and WebXR, it runs on AR-capable devices and has been tested on **Meta Quest 3**. This README covers gameplay, architecture, developer setup, smart contract interactions, and future work.

---

## Important links

[YouTube Video]()

[Project page at ETHGlobal.com]()

---

## The Story

The idea of crypto is rare and unique, so rare, in fact, that entire parallel universes are terrified of what it might become. Only one group was bold enough, or gloriously unhinged enough, to try to steal the idea from humankind: the **Alliance of the Coinosphericals**. They’re notorious as the galaxy’s most ruthless mercenaries, which is impressive considering they once lost an entire stellar system over a poker game at a pub on the edge of the universe. True story. Sort of.

Now they’re threatening humanity with a campaign more painful than every Wei ever burned on failed transactions across every ledger in existence. Spoiler: it’s not subtle.

We don’t have much time to prepare.

Scratch that. We don’t have time at all.

They’ve broken their chains. They’ve left ours.

Put on your AR headset and look around. They’re here. They’re everywhere. They’re annoyingly persistent and suspiciously photogenic.

There’s only one way to stop them: mint them into NFTs. Yes, really. It’s the only thing the Coinosphericals respect, blockchain bureaucracy and a good token URI.

Accept your fate and your duty. Defend crypto for our children, our grandchildren, and anyone who still thinks gas fees are a personality trait.

---

## Overview

**Concept**  

Players explore AR fields to find eight alien pieces, collect sets of five pieces to mint unique NFTs, and optionally use field boosters to influence gameplay. The project demonstrates an end-to-end AR + blockchain prototype.

**Key Features**
- **AR hunt** using A-Frame and WebXR
- **8 alien pieces** collectible in the world
- **Minting mechanic**: combine **5 pieces** to mint an NFT
- **Finite combinatorics**: 6 combinable species produce **7776** unique combinations
- **Field boosters** purchasable on-chain
- **Smart contracts** manage NFTs and boosters
- **Tested on Meta Quest 3**

---

## Species and Boosters

**Design decision**  
To match the stated combinatorics (7776 combinations), the minting system uses **6 combinable species**. The last two species are special and are **not** part of the combinable pool.

| **Type** | **Name** | **Role** |
|---|---|---|
| **Species 1** | Mintling | Combinable |
| **Species 2** | Gasoid | Combinable |
| **Species 3** | Contracteur (Cannie) | Combinable |
| **Species 4** | Droppee | Combinable |
| **Species 5** | Vivido | Combinable |
| **Species 6** | Hidee | Combinable |
| **Species 7** | Gamblet | Special |
| **Species 8** | Omno | Special |

**Gamblets** can double or nullify the results of your hunting season depending on your luck.

**Omnos** transfrom themselves at the end to random species out of the base 6.

With the help of ENS Names you can form groups to make a whole collection with all of
the combinations. 7776 NFT is not that much, but if you collect all of them in a group, together with others, the experience is even better.

| **Booster** | **Effect** |
|---|---|
| **HandSolo** | Lets ypu to capture alines with one controller (by default you need both hands) |
| **BulletTime** | Slows down enemies for easier capture |
| **AlienAscending** | Temporarily forbids aliens to hide themselves behind real-world object |
| **ThePurge** | Clears the entire room and you get all of them (It's not at all cheap, you know...) |

---

## Minting Mechanics

**How minting works**
- A player must submit **exactly 5 alien pieces** to mint one NFT.
- Only the **first 6 species** are combinable for minting.
- Each of the 5 slots can be any of the 6 combinable species.
- Total unique combinations: \(6^5 = 7776\).
- Each minted NFT is unique to its 5-piece combination.

**Token model**
- **NFTs**: ERC-721 style unique tokens representing a 5-piece combination.
- **Boosters**: subscription alike model for the first 3 booster, your per each for ThePurge for sure.

**On-chain flow**
1. Player collects 5 pieces in-game.
2. Game constructs a **mint request** payload (species IDs + player wallet).
3. Player signs transaction via wallet (MetaMask Mobile / WalletConnect / in-VR wallet).
4. Smart contract verifies pieces and mints NFT to player.
5. Game updates player inventory on success.

---

## Architecture

**High level**
- **Client**: A-Frame JS app (WebXR) running in browser/VR headset.
- **Backend**: Optional server for game state, leaderboards, and off-chain inventory (can be serverless).
- **Blockchain**: Smart contracts for NFTs and boosters (deployed to testnet for hackathon).
- **Wallet integration**: Ethers JS for onchain ETH payment, WalletConnect for everything else.

**Tech stack**
- **Frontend**: A-Frame, three.js, plain JavaScript, WebXR APIs
- **Blockchain**: Solidity smart contracts,
- **Wallet**: Ethers.js for contract calls
- **Storage**: NFT metadata is stored in the minting contract
- **Testing**: Meta Quest 3 for AR testing; desktop browser for development
