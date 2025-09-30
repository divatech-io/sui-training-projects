import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { TESTNET_TIP_JAR_ID, TESTNET_TIP_JAR_PACKAGE_ID } from "./constants";

export const {
  networkConfig,
  useNetworkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      tipJarPackageId: TESTNET_TIP_JAR_PACKAGE_ID,
      tipJarId: TESTNET_TIP_JAR_ID,
    },
  },
});
