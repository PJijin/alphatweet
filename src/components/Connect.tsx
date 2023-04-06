import { trpc } from "@/config/trpc";
import { ReactComponent as Cherry } from "@/icons/cherry-large.svg";
import { formatter } from "@/utils/formatters";
import { ConnectKitButton, useSIWE } from "connectkit";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ReactComponent as WalletIcon } from "@/icons/wallet.svg";
interface ConnectedProps {
  showBottom?: boolean;
}

export function Connect({ showBottom }: ConnectedProps) {
  const { isConnected } = useAccount();
  const { isSignedIn } = useSIWE();
  return isSignedIn && isConnected ? (
    <Connected showBottom={showBottom} />
  ) : (
    <NotConnected />
  );
}

export function ConnectButton() {
  const { isSignedIn } = useSIWE();
  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, truncatedAddress }) => (
        <button
          onClick={show}
          aria-label="Connect Wallet"
          className="flex items-center justify-center w-full gap-2 px-4 py-2 font-bold text-gray-300 border border-gray-300 rounded-full"
        >
          {isConnected
            ? !isSignedIn
              ? "Sign in with Ethereum"
              : truncatedAddress
            : "Connect Wallet"}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}

interface ConnectedProps {
  showBottom?: boolean;
}

export function Connected({ showBottom = true }: ConnectedProps) {
  const { address } = useAccount();
  const router = useRouter();

  const { data: stats } = trpc.authorStats.useQuery(undefined, {
    initialData: {
      unlocked: 0,
      created: 0,
    },
    enabled: showBottom,
  });

  return (
    <div
      className="grid w-full divide-y divide-brand-dark rounded-xl bg-brand-pale-blue text-brand-dark"
      style={{
        boxShadow: "4px 4px 40px -2px rgba(91, 173, 233, 1)",
      }}
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex flex-col">
          <div> My Wallet </div>
          <p className="text-base font-bold">
            {formatter.minifyAddress(address!)}
          </p>
        </div>
        <div>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button
                className="p-1"
                aria-label="open wallet window"
                onClick={show}
              >
                <WalletIcon />
              </button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>
      {showBottom && (
        <div className="grid grid-cols-2 divide-x divide-brand-dark">
          <div className="p-6 space-y-2">
            <div> Created </div>
            <p className="text-xl font-bold">{stats?.created}</p>
          </div>
          <div className="p-6 space-y-2">
            <div> Unlocked </div>
            <p className="text-xl font-bold">{stats?.unlocked}</p>
          </div>
        </div>
      )}
      {showBottom && (
        <div className="flex items-center justify-between p-6">
          <button
            onClick={(event) => {
              event.preventDefault();
              router.push("/profile");
            }}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 font-bold border rounded-full text-brand-dark border-brand-dark"
          >
            View my profile
          </button>
        </div>
      )}
    </div>
  );
}

export function NotConnected() {
  return (
    <div
      className="flex flex-col max-w-xs gap-6 p-6 rounded-3xl"
      style={{
        boxShadow: "4px 4px 40px -2px rgba(91, 173, 233, 1)",
      }}
    >
      <div className="grid gap-6 justify-items-center">
        <Cherry />
        <p>
          ALPHA tweet enables you to token-gate your tweets & empower your
          followers to earn rewards.
        </p>
      </div>
      <div className="grid gap-4 justify-items-center">
        <ConnectButton />
        <p className="text-sm">
          Digital wallet is required to create ALPHA and earn reward.
        </p>
      </div>
    </div>
  );
}