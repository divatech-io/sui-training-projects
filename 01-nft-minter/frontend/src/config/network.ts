import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { TESTNET_NFT_MINTER_PACKAGE_ID } from "./constants";

export const {
  networkConfig,
  useNetworkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      nftMinterPackageId: TESTNET_NFT_MINTER_PACKAGE_ID,
    },
  },
});
