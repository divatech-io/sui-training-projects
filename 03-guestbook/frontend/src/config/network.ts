import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import {
  TESTNET_GUESTBOOK_ID,
  TESTNET_GUESTBOOK_PACKAGE_ID,
} from "./constants";

export const {
  networkConfig,
  useNetworkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      guestbookPackageId: TESTNET_GUESTBOOK_PACKAGE_ID,
      guestbookId: TESTNET_GUESTBOOK_ID,
    },
  },
});
