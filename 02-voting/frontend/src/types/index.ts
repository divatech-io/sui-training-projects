export type RpcVote = {
  value: boolean;
};

export type Vote = "yes" | "no";

export type RpcProposal = {
  id: string;
  no: string;
  yes: string;
  statement: string;
};

export type Proposal = {
  id: string;
  no: number;
  yes: number;
  statement: string;
};
