import type { Contract, ContractMethod } from "ethers";

export const requireMethods = (
  contract: Contract,
  ...methods: string[]
): ContractMethod<any[], any, any>[] => {
  const funcs: ContractMethod<any[], any, any>[] = [];

  for (const method of methods) {
    const func = contract.getFunction(method);
    if (!func) {
      throw new Error(
        `Method ${method} not found on contract ${contract.address}`
      );
    }

    funcs.push(func!);
  }

  return funcs;
};
