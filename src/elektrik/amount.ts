// Uniswap V3 pricing formula
export function calculateAmountOut(
  amountIn: bigint,
  sqrtPriceX96: bigint,
  liquidity: bigint
): bigint {
  const Q96 = BigInt(2) ** BigInt(96);
  const price = sqrtPriceX96 ** BigInt(2) / Q96;
  const amountOut = (amountIn * liquidity) / price;
  return amountOut;
}

export function calcMinAmountOut(amount: bigint, slippage: number): bigint {
  const BP_PRECISION = 10000;
  const slippageBP = BigInt(Math.floor(slippage * BP_PRECISION));
  const loss = (amount * slippageBP) / BigInt(BP_PRECISION);
  return amount - loss;
}
