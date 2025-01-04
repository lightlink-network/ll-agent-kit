import type { Route } from "@uniswap/v3-sdk";
import { Contract, type Provider, type Wallet } from "ethers";
import { requireMethods } from "../utils.js";
import { AbiCoder, ethers } from "ethers";
import { universalRouterABI } from "../abis/elektrikRouter.js";

class UniversalRouter {
  private universalRouter: Contract;

  constructor(routerAddress: string, provider: Provider) {
    this.universalRouter = new Contract(
      routerAddress,
      universalRouterABI,
      provider
    );
  }

  /**
   * @description Triggers a v3 swap on the universal router.
   * @param wallet - The wallet to use for the swap.
   * @param amountIn - The amount of tokens to swap.
   * @param amountOutMin - The minimum amount of tokens to receive.
   * @param fee - The fee to use for the swap.
   * @param path - The path to use for the swap.
   * @returns The transaction that was sent.
   * @dev It runs the V3_SWAP_EXACT_IN command on the universalRouter.
   * ```
   * V3_SWAP_EXACT_IN = 0x00
   * INPUTS = abi.encode(wallet.address, amountIn, amountOutMin,
   *    abi.encodePacked(path.tokenIn, fee, path.tokenOut), true)
   * universalRouter.execute(V3_SWAP_EXACT_IN, inputs)
   * ```
   */
  async swapExactIn(
    wallet: Wallet,
    amountIn: bigint,
    amountOutMin: bigint,
    path: { tokenIn: string; tokenOut: string; fee: number }
  ) {
    const SWAP_EXACT_IN = "0x00";

    const v3SwapRoute = ethers.solidityPacked(
      ["address", "uint24", "address"],
      [path.tokenIn, path.fee, path.tokenOut]
    );

    const inputs = AbiCoder.defaultAbiCoder().encode(
      // Encode the inputs for V3_SWAP_EXACT_IN
      ["address", "uint256", "uint256", "bytes", "bool"],
      [wallet.address, amountIn, amountOutMin, v3SwapRoute, true]
    );

    const [executeMethod] = requireMethods(
      this.universalRouter.connect(wallet) as any,
      "execute"
    );
    const tx = await executeMethod!(SWAP_EXACT_IN, [inputs]);
    await tx.wait();

    return tx;
  }
}

export default UniversalRouter;
