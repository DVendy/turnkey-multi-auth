import { PublicClient, WalletClient } from "viem";
import sepoliaAbi from '../resources/sepolia-storage-abi.json';

interface Props {
    publicClient?: PublicClient
    walletClient?: WalletClient
}

const useStorageContract = (props: Props) => {
    const contractAddress = '0x2331fb827792879D21e11f7e13bA0d57391393D5';

    const retrieve = async () => {
        console.log('retrieve');
        try {
            if (props.publicClient === undefined) {
                throw 'Public client undefined';
            }
            const result = await props.publicClient?.readContract({
                address: contractAddress,
                abi: sepoliaAbi.abi,
                functionName: 'retrieve',
                args: [],
            });
            console.log('useSepoliaTestContract.retrieve', result);

            return result?.toString();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    const store = async (value: Number) => {
        console.log('store');
        try {
            if (props.publicClient === undefined) {
                throw 'Public client undefined';
            }
            if (props.walletClient === undefined) {
                throw 'Wallet client undefined';
            }
            const { request } = await props.publicClient.simulateContract({
                account: props.walletClient.account,
                address: contractAddress,
                abi: sepoliaAbi.abi,
                functionName: 'store',
                args: [value]
            })
            console.log('Store request', request);
            const storeHash = await props.walletClient.writeContract(request);
            console.log('Store hash', storeHash);

            const storeReceipt = await props.publicClient.waitForTransactionReceipt({ hash: storeHash });
            console.log('Store receipt', storeReceipt);
            return `Transaction executed`;
        } catch (error) {
            console.error(error);
            return 'error';
        }
    }

    return {
        retrieve,
        store
    };
}

export default useStorageContract;