import type { Token } from "@elektrik/sdk-core";
import { Contract, type JsonRpcProvider } from "ethers";
import type { Network } from "../network.js";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { IElektrikFactoryABI } from "../abis/elektrikFactory.js";
import { requireMethods } from "../utils.js";
import type { Provider } from "ethers";
import { IElektrikPoolABI } from "../abis/eletrikPool.js";

const _findPoolAddress = async (
  factoryAddress: string,
  provider: Provider,
  fromToken: string,
  toToken: string,
  fee = FeeAmount.MEDIUM
) => {
  // Try querying the factory
  const factoryContract = new Contract(
    factoryAddress,
    IElektrikFactoryABI,
    provider
  );

  const [getPool] = requireMethods(factoryContract, "getPool");
  const poolAddress = await getPool!(fromToken, toToken, fee);

  // If the pool is not deployed, return 0x
  if ((await provider.getCode(poolAddress)) === "0x") return "0x";

  // otherwise the pool is deployed
  return poolAddress as string;
};

export const findPoolAddress = async (
  factoryAddress: string,
  provider: Provider,
  fromToken: string,
  toToken: string
) => {
  const fees = [FeeAmount.MEDIUM, FeeAmount.LOW, FeeAmount.HIGH];

  for (const fee of fees) {
    const poolAddress = await _findPoolAddress(
      factoryAddress,
      provider,
      fromToken,
      toToken,
      fee
    );
    if (poolAddress !== "0x") return poolAddress;
  }

  throw new Error(
    `Pool not found for that Token pair ${fromToken} -> ${toToken}`
  );
};

export const getPoolInfo = async (poolAddress: string, provider: Provider) => {
  const poolContract = new Contract(poolAddress, IElektrikPoolABI, provider);

  const [feeCall, tickSpacingCall, liquidityCall, slot0Call] = requireMethods(
    poolContract,
    "fee",
    "tickSpacing",
    "liquidity",
    "slot0"
  );

  const [fee, tickSpacing, liquidity, slot0] = await Promise.all([
    feeCall!(),
    tickSpacingCall!(),
    liquidityCall!(),
    slot0Call!(),
  ]);

  return {
    address: poolAddress,
    fee: fee as bigint,
    tickSpacing: tickSpacing as bigint,
    liquidity: liquidity as bigint,
    sqrtPriceX96: slot0[0] as bigint,
    tick: slot0[1] as bigint,
  };
};
