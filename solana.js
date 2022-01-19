import web3 from "@solana/web3.js";

export const newWallet = () => {
    return new web3.Keypair();
}

export const transferSOL = async (from, to, amt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey : new web3.PublicKey(from.publicKey),
                toPubkey : new web3.PublicKey(to.publicKey),
                lamports : amt*web3.LAMPORTS_PER_SOL
            })
        )
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const getWalletBalance = async (wallet)=>{
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const balance = await connection.getBalance(new web3.PublicKey(wallet.publicKey));
        return balance/web3.LAMPORTS_PER_SOL;
    } catch(err) {
        throw err;
    }
}

export const airDropSol = async (wallet, amt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        const fromAirDropSignature = await connection.requestAirdrop(
            new web3.PublicKey(wallet.publicKey),
            amt * web3.LAMPORTS_PER_SOL
        );
        const signature = await connection.confirmTransaction(fromAirDropSignature);
        console.log(signature);
    } catch (err) {
        console.log(err);
    }
};

const userSecretKey = [
    229,  65,  12, 110, 128, 101,  62, 119, 239,  95,  26,
     67, 178,  99,  40,  77,  46, 151, 163, 227, 167,   5,
    138, 101, 140, 195, 212, 161, 105, 216,  79,  73,   6,
     85, 188,  71, 255,  12, 214, 102,  84, 170, 129, 127,
     64,  57, 133,  22,  10,   9, 135,  34,  75, 223, 107,
    252, 253,  22, 242, 135, 180, 245, 221, 155
]

export const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));


//Treasury
const secretKey = [
    111, 188,  76, 169,  30, 105, 254,  33, 228,  66,  56,
    215,   9,  37,  51, 188, 188, 188,  20, 224, 228, 115,
     17, 163, 151, 105, 113, 251, 105, 177,  28, 157, 125,
    202, 195, 203, 253, 137,  26, 209,   7,   2,  66, 193,
     76, 241, 203, 168, 213,   5, 226,  11, 142,  44, 125,
    191, 167, 172, 166, 207, 176, 137, 210,  27
]

export const treasuryWallet = web3.Keypair.fromSecretKey(Uint8Array.from(secretKey));