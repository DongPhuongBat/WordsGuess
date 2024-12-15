import { fromText, Script } from "lucid-cardano";
import React, { useState } from 'react';
import { useLucid } from '../context/LucidProvider';

interface MintTokenValidatorProps {
    level: number;
    timeLeft: number;
    points: number;
    word: string;
}

export const MintTokenValidator: React.FC<MintTokenValidatorProps> = ({
    level,
    timeLeft,
    points,
    word
}) => {
    const { lucid } = useLucid();
    const [txHash, setTxHash] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Tạo thông tin NFT dựa trên thành tích
    const generateTokenInfo = () => {
        const performance = Math.min(100, (points / (timeLeft + 1)) * 100); // Đảm bảo hiệu suất tối đa là 100%
        const rating = performance >= 80 ? "S" :
            performance >= 60 ? "A" :
                performance >= 40 ? "B" : "C";

        const tokenName = `L${level}_${word}_${rating}`;
        const tokenDescription = `Level ${level}, Points: ${points}, Time Left: ${timeLeft}s, Rating: ${rating}`;

        const imageUrls = {
            S: "ipfs://QmS...",
            A: "ipfs://QmA...",
            B: "ipfs://QmB...",
            C: "ipfs://QmC...",
        };

        return {
            name: tokenName,
            desc: tokenDescription,
            img: imageUrls[rating as keyof typeof imageUrls],
            attr: {
                level,
                time: timeLeft,
                points,
                word,
                rating,
            },
        };
    };

    const mintingPolicyId = async () => {
        if (!lucid) throw new Error("Lucid instance not found");

        const { paymentCredential } = lucid.utils.getAddressDetails(
            await lucid.wallet.address()
        );

        if (!paymentCredential) throw new Error("Payment credential not found");

        const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
            type: "all",
            scripts: [
                { type: "sig", keyHash: paymentCredential.hash },
                {
                    type: "before",
                    slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
                },
            ],
        });

        return {
            policyId: lucid.utils.mintingPolicyToId(mintingPolicy),
            mintingPolicy,
        };
    };

    const mintAchievementNFT = async () => {
        try {
            setLoading(true);
            if (!lucid) throw new Error("Lucid instance not found");

            const tokenInfo = generateTokenInfo();
            const { mintingPolicy, policyId } = await mintingPolicyId();
            const assetName = fromText(tokenInfo.name);

            const tx = await lucid
                .newTx()
                .mintAssets({ [`${policyId}${assetName}`]: BigInt(1) })
                .attachMetadata(721, {
                    [policyId]: {
                        [tokenInfo.name]: tokenInfo,
                    },
                })
                .validTo(Date.now() + 200000)
                .attachMintingPolicy(mintingPolicy)
                .complete();

            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            await lucid.awaitTx(txHash);

            setTxHash(txHash);
        } catch (error) {
            console.error("Minting error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-6 bg-white rounded-xl border-2 border-blue-300 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Claim NFT</h2>

            <div className="bg-blue-100 p-5 rounded-lg mb-4 text-blue-700 shadow-md">
                <p className="mb-2 text-lg">Level {level} Achievement</p>
                <p className="mb-2 text-lg">
                    Points: <span className="font-semibold">{points}</span>
                </p>
                <p className="mb-2 text-lg">
                    Time Left: <span className="font-semibold">{timeLeft}s</span>
                </p>
                <p className="text-lg font-bold">
                    Rating:
                    <span
                        className={
                            Math.min(100, (points / (timeLeft + 1)) * 100) >= 80
                                ? "text-green-600"
                                : Math.min(100, (points / (timeLeft + 1)) * 100) >= 60
                                    ? "text-yellow-600"
                                    : Math.min(100, (points / (timeLeft + 1)) * 100) >= 40
                                        ? "text-blue-600"
                                        : "text-red-600"
                        }
                    >
                        {" "}
                        {Math.min(100, (points / (timeLeft + 1)) * 100) >= 80
                            ? "S"
                            : Math.min(100, (points / (timeLeft + 1)) * 100) >= 60
                                ? "A"
                                : Math.min(100, (points / (timeLeft + 1)) * 100) >= 40
                                    ? "B"
                                    : "C"}
                    </span>
                </p>
            </div>

            <button
                onClick={mintAchievementNFT}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300
      ${loading
                        ? 'bg-gray-300 text-blue-400 cursor-not-allowed shadow-none'
                        : 'bg-blue-500 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-300'}
    `}
            >
                {loading ? 'Minting...' : 'Mint Achievement NFT'}
            </button>

            {txHash && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-300">
                    <p className="text-sm text-blue-600">
                        Transaction hash:
                        <a
                            href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono ml-2 break-all text-blue-800 hover:text-blue-500"
                        >
                            {txHash}
                        </a>
                    </p>
                </div>
            )}
        </div>


    );
};
