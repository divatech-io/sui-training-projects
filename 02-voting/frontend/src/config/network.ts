import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { TESTNET_VOTING_PACKAGE_ID } from "./constants";

export const {
  networkConfig,
  useNetworkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      votingPackageId: TESTNET_VOTING_PACKAGE_ID,
    },
  },
});
