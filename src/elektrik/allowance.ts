import { Contract, type Wallet } from "ethers";
import { requireMethods } from "../utils.js";
import { ERC20ABI } from "../abis/erc20.js";
import { Permit2ABI } from "../abis/permit2.js";
import type { WalletProvider } from "./common.js";
import type { Provider } from "ethers";

async function ensureApproval(
  provider: Provider,
  wallet: WalletProvider,
  token: string,
  target: string,
  amount: bigint
) {
  const senderAddress = await wallet.getAddress();

  const tokenContract = new Contract(token, ERC20ABI, provider);
  const [allowanceMethod] = requireMethods(tokenContract, "allowance");

  let allowance = await allowanceMethod!(senderAddress, target);

  if (allowance < amount) {
    console.log("Approving token transfer", target, amount);
    const callData = await tokenContract.interface.encodeFunctionData(
      "approve",
      [target, amount]
    );
    const tx = await wallet.sendTransaction({
      to: token,
      data: callData,
    });
    await tx.wait();

    allowance = amount;
  }

  return allowance;
}

export const ensurePermit2 = async (
  provider: Provider,
  wallet: WalletProvider,
  permit2: string,
  token: string,
  target: string,
  amount: bigint
) => {
  // Step 1. Ensure Permit2 is approved
  await ensureApproval(provider, wallet, token, permit2, amount);
  const senderAddress = await wallet.getAddress();

  // Step 2. Check if target is approved on Permit2
  const permit2Contract = new Contract(permit2, Permit2ABI, provider);
  const [allowanceMethod] = requireMethods(permit2Contract, "allowance");
  const allowance = await allowanceMethod!(senderAddress, token, target);
  if (allowance >= amount) {
    return;
  }

  // Step 3. Approve Permit2 on target
  await approvePermit2(provider, wallet, permit2, token, target, amount);
};

const approvePermit2 = async (
  provider: Provider,
  wallet: WalletProvider,
  permit2: string,
  token: string,
  target: string,
  amount: bigint
) => {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  const deadline = Math.floor(Date.now() / 1000) + ONE_DAY_IN_SECONDS;

  const permit2Contract = new Contract(permit2, Permit2ABI, provider);
  const callData = await permit2Contract.interface.encodeFunctionData(
    "approve",
    [token, target, amount, deadline]
  );

  const tx = await wallet.sendTransaction({
    to: permit2,
    data: callData,
  });

  await tx.wait();
  return tx;
};
