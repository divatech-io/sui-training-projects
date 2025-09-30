import { SuiGraphQLClient } from "@mysten/sui/graphql";

export const gqlClient = new SuiGraphQLClient({
  url: "https://sui-testnet.mystenlabs.com/graphql",
});
