import type { Proposal, RpcProposal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "@mysten/sui/graphql/schemas/latest";
import { gqlClient } from "@/config/graphql";
import { useNetworkVariables } from "@/config/network";

export function useProposalsQuery() {
  const networkVariables = useNetworkVariables();

  return useQuery({
    queryKey: ["proposals", networkVariables.votingPackageId],
    queryFn: async () => {
      return await fetchObjects({
        type: `${networkVariables.votingPackageId}::voting::Proposal`,
      });
    },
    select: function (data): Proposal[] {
      return data.objects.edges
        .map((x) => {
          if (!x.node.asMoveObject?.contents) return undefined;

          const proposalFields = x.node.asMoveObject.contents
            .json as RpcProposal;

          return {
            id: proposalFields.id,
            no: parseInt(proposalFields.no),
            yes: parseInt(proposalFields.yes),
            statement: proposalFields.statement,
          } as Proposal;
        })
        .filter((x) => !!x);
    },
  });
}

async function fetchObjects({ type }: { type: string }) {
  const query = graphql(`
    query {
      objects(filter: { type: "${type}" }) {
        edges {
          node {
            asMoveObject {
              contents {
                json
              }
            }
          }
        }
      }
    }
  `);

  const response = await gqlClient.query({
    query,
  });

  if (!response.data) {
    throw new Error("Request failed");
  }

  return response.data;
}
