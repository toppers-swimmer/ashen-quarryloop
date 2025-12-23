import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
  parseAbi,
  formatUnits,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type Net = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETWORKS: Net[] = [
  {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
  {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
];

let active = NETWORKS[0];

const sdk = new CoinbaseWalletSDK({
  appName: "Ashen Quarryloop (Built for Base)",
  appLogoUrl: "https://base.org/favicon.ico",
});

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
]);

type Session = { address: `0x${string}`; chainId: number } | null;
let session: Session = null;

const out = document.createElement("pre");
out.style.whiteSpace = "pre-wrap";
out.style.wordBreak = "break-word";
out.style.background = "#0b0f1a";
out.style.color = "#dbe7ff";
out.style.padding = "14px";
out.style.borderRadius = "14px";
out.style.border = "1px solid rgba(255,255,255,0.12)";
out.style.minHeight = "380px";

function print(lines: string[]) {
  out.textContent = lines.join("\n");
}

function client() {
  return createPublicClient({ chain: active.chain, transport: http(active.rpc) });
}

function toAddr(v: string): `0x${string}` {
  if (!isAddress(v)) throw new Error("Invalid address");
  return v as `0x${string}`;
}

async function connectWallet() {
  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const a = accounts?.[0];
  if (!a) throw new Error("No address returned from wallet");

  const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
  session = { address: toAddr(a), chainId: parseInt(chainHex, 16) };

  const [bal, bn] = await Promise.all([
    client().getBalance({ address: session.address }),
    client().getBlockNumber(),
  ]);

  print([
    "Wallet connected",
    `Network: ${active.label}`,
    `chainId: ${session.chainId}`,
    `Address: ${session.address}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `Latest block: ${bn}`,
    `Basescan: ${active.explorer}/address/${session.address}`,
  ]);
}

async function latestBlock() {
  const b = await client().getBlock();
  print([
    "Latest block snapshot",
    `Network: ${active.label}`,
    `Block: ${b.number}`,
    `Timestamp: ${b.timestamp}`,
    `Gas used: ${b.gasUsed}`,
    `Gas limit: ${b.gasLimit}`,
    `Basescan: ${active.explorer}/block/${b.number}`,
  ]);
}

async function readEthBalance(target: string) {
  const a = toAddr(target);
  const bal = await client().getBalance({ address: a });
  print([
    "ETH balance lookup",
    `Network: ${active.label}`,
    `Address: ${a}`,
    `Balance: ${formatEther(bal)} ETH`,
    `Basescan: ${active.explorer}/address/${a}`,
  ]);
}

async function readErc20(token: string, holder: string) {
  const tokenAddr = toAddr(token);
  const holderAddr = toAddr(holder);

  const c = client();
  const [name, symbol, decimals, supply, bal] = await Promise.all([
    c.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "name" }),
    c.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "symbol" }),
    c.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "decimals" }),
    c.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: "totalSupply" }),
    c.readContract({
      address: tokenAddr,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [holderAddr],
    }),
  ]);

  const d = Number(decimals);

  print([
    "ERC-20 snapshot",
    `Network: ${active.label}`,
    `Token: ${tokenAddr}`,
    `Holder: ${holderAddr}`,
    `Name: ${String(name)}`,
    `Symbol: ${String(symbol)}`,
    `Decimals: ${d}`,
    `Total supply: ${formatUnits(supply as bigint, d)}`,
    `Holder balance: ${formatUnits(bal as bigint, d)}`,
    `Token: ${active.explorer}/address/${tokenAddr}`,
    `Holder: ${active.explorer}/address/${holderAddr}`,
  ]);
}

function toggleNetwork() {
  active = active.chainId === 84532 ? NETWORKS[1] : NETWORKS[0];
  session = null;
  print([`Switched to ${active.label}. Reconnect wallet to refresh.`]);
}

function mount() {
  const root = document.createElement("div");
  root.style.maxWidth = "1120px";
  root.style.margin = "24px auto";
  root.style.fontFamily = "ui-sans-serif, system-ui";

  const h1 = document.createElement("h1");
  h1.textContent = "Ashen Quarryloop";

  const blurb = document.createElement("div");
  blurb.textContent =
    "Built for Base: wallet connection, chainId validation, and read-only ETH + ERC-20 inspection with Basescan references.";
  blurb.style.opacity = "0.8";
  blurb.style.marginBottom = "12px";

  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.flexWrap = "wrap";
  row.style.gap = "10px";
  row.style.marginBottom = "10px";

  const row2 = document.createElement("div");
  row2.style.display = "flex";
  row2.style.flexWrap = "wrap";
  row2.style.gap = "10px";
  row2.style.marginBottom = "12px";

  function btn(label: string, fn: () => void | Promise<void>) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.padding = "8px 10px";
    b.onclick = () =>
      Promise.resolve(fn()).catch((e) => print([`Error: ${e?.message ?? String(e)}`]));
    return b;
  }

  const addrInput = document.createElement("input");
  addrInput.placeholder = "0x… address (defaults to connected wallet)";
  addrInput.style.minWidth = "380px";
  addrInput.style.padding = "8px 10px";

  const tokenInput = document.createElement("input");
  tokenInput.placeholder = "0x… ERC-20 token address";
  tokenInput.style.minWidth = "380px";
  tokenInput.style.padding = "8px 10px";

  row.append(
    btn("Connect Wallet", connectWallet),
    btn("Toggle Network", toggleNetwork),
    btn("Latest Block", latestBlock),
  );

  row2.append(
    addrInput,
    btn("Read ETH Balance", () =>
      readEthBalance((addrInput.value.trim() || session?.address || "").toString()),
    ),
    tokenInput,
    btn("Read ERC-20", () =>
      readErc20(tokenInput.value.trim(), (addrInput.value.trim() || session?.address || "").toString()),
    ),
  );

  root.append(h1, blurb, row, row2, out);
  document.body.appendChild(root);

  print(["Ready", `Active network: ${active.label}`, "Connect wallet to begin (read-only)."]);
}

mount();
