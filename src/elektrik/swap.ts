import type { Wallet } from "ethers";
import type { Network } from "../network.js";
import UniversalRouter from "./universalRouter.js";
import { findPoolAddress, getPoolInfo } from "./pool.js";
import { calcMinAmountOut, calculateAmountOut } from "./amount.js";
import { ensurePermit2 } from "./allowance.js";

export const swapExactIn = async (
  wallet: Wallet,
  permit2: string,
  factoryAddress: string,
  routerAddress: string,
  amountIn: bigint,
  tokenIn: string,
  tokenOut: string,
  slippage: number
) => {
  if (!wallet.provider) throw new Error("Wallet provider not found");

  // Find the pool information
  const poolInfo = await getPoolInfo(
    await findPoolAddress(factoryAddress, wallet.provider, tokenIn, tokenOut),
    wallet.provider
  );
  console.log("GOT POOL ADDRESS", poolInfo.address, poolInfo.fee);

  // Calculate the amount out (with slippage applied)
  //   const amountOutMin = calcMinAmountOut(
  //     calculateAmountOut(amountIn, poolInfo.sqrtPriceX96, poolInfo.liquidity),
  //     slippage
  //   );
  const amountOutMin = 1n;

  // Ensure the router is approved
  await ensurePermit2(permit2, wallet, tokenIn, routerAddress, amountIn);

  // Do the swap
  const router = new UniversalRouter(routerAddress, wallet.provider);
  const tx = await router.swapExactIn(wallet, amountIn, amountOutMin, {
    tokenIn,
    tokenOut,
    fee: Number(poolInfo.fee),
  });

  return tx;
};
