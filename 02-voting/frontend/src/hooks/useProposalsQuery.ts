import { VOTING_PACKAGE_OBJECT_ID } from "@/config/objects";
import type { Proposal, SuiProposal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "@mysten/sui/graphql/schemas/latest";
import { gqlClient } from "@/config/graphql";

export function useProposalsQuery() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: fetchGraphQLData,
    select: function (data): Proposal[] {
      return data.objects.edges.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (x: any) => {
          const proposalFields = x.node.asMoveObject.contents
            .json as SuiProposal;
          return {
            id: proposalFields.id,
            no: parseInt(proposalFields.no),
            yes: parseInt(proposalFields.yes),
            statement: proposalFields.statement,
          } as Proposal;
        }
      );
    },
  });
}

const fetchGraphQLData = async () => {
  const query = graphql(`
    query {
      objects(filter: { type: "${VOTING_PACKAGE_OBJECT_ID}::voting::Proposal" }) {
        edges {
          node {
            address
            version
            digest
            asMoveObject {
              contents {
                type {
                  repr
                }
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
    throw new Error("Network response was not ok");
  }

  return response.data;
};
