import { Contract, type Wallet } from "ethers";
import { requireMethods } from "../utils.js";
import { ERC20ABI } from "../abis/erc20.js";
import type { Network } from "../network.js";
import { Permit2ABI } from "../abis/permit2.js";

async function ensureApproval(
  wallet: Wallet,
  token: string,
  target: string,
  amount: bigint
) {
  const tokenContract = new Contract(token, ERC20ABI, wallet);
  const [allowanceMethod, approveMethod] = requireMethods(
    tokenContract,
    "allowance",
    "approve"
  );

  let allowance = await allowanceMethod!(wallet.address, target);

  if (allowance < amount) {
    console.log("Approving token transfer", target, amount);
    const tx = await approveMethod!(target, amount);
    await tx.wait();
    allowance = amount;
  }

  return allowance;
}

export const ensurePermit2 = async (
  permit2: string,
  wallet: Wallet,
  token: string,
  target: string,
  amount: bigint
) => {
  // Step 1. Ensure Permit2 is approved
  await ensureApproval(wallet, token, permit2, amount);

  // Step 2. Check if target is approved on Permit2
  const permit2Contract = new Contract(permit2, Permit2ABI, wallet);
  const [allowanceMethod] = requireMethods(permit2Contract, "allowance");
  const allowance = await allowanceMethod!(wallet.address, token, target);
  if (allowance >= amount) {
    return;
  }

  // Step 3. Approve Permit2 on target
  await approvePermit2(permit2, wallet, token, target, amount);
};

const approvePermit2 = async (
  permit2: string,
  wallet: Wallet,
  token: string,
  target: string,
  amount: bigint
) => {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  const deadline = Math.floor(Date.now() / 1000) + ONE_DAY_IN_SECONDS;

  const permit2Contract = new Contract(permit2, Permit2ABI, wallet);
  const [approveMethod] = requireMethods(permit2Contract, "approve");
  const tx = await approveMethod!(token, target, amount, deadline);

  await tx.wait();
  return tx;
};
