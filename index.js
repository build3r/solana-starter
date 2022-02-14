const {
  Connection,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  SystemProgram,
  Keypair,
} = require('@solana/web3.js');
const fs   = require('mz/fs');

async function establishConnection() {
  const rpcUrl = 'http://localhost:8899';
  connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
}

async function createKeypairFromFile() {
  const secretKeyString = "[104,168,46,197,223,81,139,191,93,10,214,142,225,120,216,114,227,30,75,45,234,10,89,237,56,252,93,239,240,239,186,98,93,164,244,106,206,3,214,173,198,45,163,35,151,132,182,219,6,58,131,34,102,61,242,52,232,169,17,19,223,187,218,229]"//await fs.readFile("~/.config/solana/id.json", {encoding: 'utf8'});
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

async function createAccount() {

  const rpcUrl = 'http://localhost:8899';
  connection = new Connection(rpcUrl, 'confirmed');
  const signer = await createKeypairFromFile();
  const newAccountPubkey = await PublicKey.createWithSeed(
    signer.publicKey,
    "campaign1",
    new PublicKey("5tqYnnWwATuXjsNCrmCakCnPMhtRTSr6NYr7XUHgKagQ"),
  );
  const lamports = await connection.getMinimumBalanceForRentExemption(
    1024,
  );
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: signer.publicKey,
    basePubkey: signer.publicKey,
    seed: "campaign1",
    newAccountPubkey,
    lamports,
    space: 1024,
    programId : new PublicKey("5tqYnnWwATuXjsNCrmCakCnPMhtRTSr6NYr7XUHgKagQ"),
  });
  const transaction = new Transaction().add(
    instruction
  );

  console.log(`The address of campaign1 account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction, [signer]);

}



establishConnection();
createAccount();
