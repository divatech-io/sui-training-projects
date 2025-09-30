import { VOTING_PACKAGE_OBJECT_ID } from "@/config/objects";
import type { Proposal, SuiProposal } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useProposalsQuery() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: fetchGraphQLData,
    select: function (data): Proposal[] {
      return data.data.objects.edges.map(
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
  const query = `
    query {
      objects(filter: { ownerKind: "SHARED", type: "${VOTING_PACKAGE_OBJECT_ID}::voting::Proposal" }) {
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
  `;

  const response = await fetch("https://graphql.testnet.sui.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
