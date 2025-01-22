import type { Provider } from "ethers";
import UniversalRouter from "./universalRouter.js";
import { findPoolAddress, getPoolInfo } from "./pool.js";
import { ensurePermit2 } from "./allowance.js";
import type { WalletProvider } from "./common.js";

export const swapExactIn = async (
  provider: Provider,
  wallet: WalletProvider,
  permit2: string,
  factoryAddress: string,
  routerAddress: string,
  amountIn: bigint,
  tokenIn: string,
  tokenOut: string,
  slippage: number
) => {
  // Find the pool information
  const poolInfo = await getPoolInfo(
    await findPoolAddress(factoryAddress, provider, tokenIn, tokenOut),
    provider
  );
  console.log("GOT POOL ADDRESS", poolInfo.address, poolInfo.fee);

  // Calculate the amount out (with slippage applied)
  //   const amountOutMin = calcMinAmountOut(
  //     calculateAmountOut(amountIn, poolInfo.sqrtPriceX96, poolInfo.liquidity),
  //     slippage
  //   );
  const amountOutMin = 1n;

  // Ensure the router is approved
  await ensurePermit2(
    provider,
    wallet,
    permit2,
    tokenIn,
    routerAddress,
    amountIn
  );

  // Do the swap
  const router = new UniversalRouter(routerAddress, provider);
  const tx = await router.swapExactIn(wallet, amountIn, amountOutMin, {
    tokenIn,
    tokenOut,
    fee: Number(poolInfo.fee),
  });

  return tx;
};
