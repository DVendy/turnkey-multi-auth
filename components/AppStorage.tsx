import useStorageContract from "@/hooks/useStorageContract";
import { useState } from "react";
import { formatEther, parseEther, PublicClient, WalletClient } from "viem";

interface Props {
    publicClient: PublicClient
    walletClient: WalletClient
}


const AppStorage = (props: Props) => {
    const sepoliaTestContract = useStorageContract({
        publicClient: props.publicClient,
        walletClient: props.walletClient
    });

    const [value, setValue] = useState<number>();

    return (
        <div className="">
            <div>Storage App</div>

            <button onClick={() => {
                console.log({
                    'publicClient': props.publicClient,
                    'walletClient': props.walletClient
                });
            }}>log</button>
            <br />

            <button onClick={async () => {
                const res = await sepoliaTestContract.retrieve();
                console.log('retrieve result', res);
            }}>get</button>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
            <button onClick={async () => {
                const balance = await props.publicClient.getBalance({
                    address: props.walletClient.account?.address!
                });
                console.log('balance', formatEther(balance));

                // return;
                if (!value) {
                    return;
                }
                const res = await sepoliaTestContract.store(value);
                console.log('retrieve result', res);
            }}>set</button>
        </div>
    );
}

export default AppStorage;