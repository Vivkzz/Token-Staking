import { TokenMinter } from "@/components/token-minter";

export default function MintPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Mint MTK Tokens</h1>
      <p className="mb-8">
        Here you can mint test MTK tokens to use for staking.
      </p>
      <TokenMinter />
    </div>
  );
}
