const Web3 = require('web3')

const BridgeEth = require('../build/contracts/BridgeEth.json')
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3('wss://ropsten.infura.io/ws/v3/4a97c3f8825445f9928ffb9d0e1c8bdc');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);


const bridgeEth = new web3Eth.eth.Contract(
    BridgeEth.abi,
    BridgeEth.networks['3'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
    BridgeBsc.abi,
    BridgeBsc.networks['97'].address
);

const init = async () => {
    bridgeEth.events.Transfer(
        { fromBlock: 0, step: 0 }
    ).on('data', async event => {

        const { from, to, amount, date, nonce } = event.returnValues;

        console.log('from : ', from)
        console.log('to : ', to)
        console.log('amount : ', amount)

        console.log('event.returnValues : ', event)
        const tx = await bridgeBsc.methods.mint(to, amount, nonce);
        // const [gasPrice, gasCost] = await Promise.all([
        //     web3Bsc.eth.getGasPrice(),
        //     tx.estimateGas({ from: admin }),
        // ]);

        // const data = tx.encodeABI();
        console.log('tx : ', tx)

        // const txData = {
        //     from: admin,
        //     to: bridgeBsc.options.address,
        //     data,
        //     gas: gasCost,
        //     gasPrice
        // };

        // console.log('event.returnValues : ', event.returnValues)

        // console.log('txData : ', txData)

        // const receipt = await web3Bsc.eth.sendTransaction(txData);
        // console.log(`Transaction hash: ${receipt.transactionHash}`);
        // console.log(`
        //     Processed transfer:
        //     - from ${from} 
        //     - to ${to} 
        //     - amount ${amount} tokens
        //     - date ${date}
        //   `);
    }).on('error', console.error);

    // const res = await bridgeEth.getPastEvents('Transfer', { fromBlock: 0 })

    // console.log('res : ', res)
}

init()

const mintToken = async () => {

    console.log('bridgeBsc : ', await bridgeBsc.methods.mint('0x75e73ABf1F0144d56946121B3D86287f6251AB67', 10, 123))
    // const bridgeBscRes = await bridgeBsc.methods.mint(to, amount, 100);


    // const balanceOfRes = await bridgeBsc.methods.balanceOf('0xfF8A240D16412f6A4cbf27Fb10629a24b97d4873').call();
    
    // console.log('balanceOfRes : ', balanceOfRes)
}

// mintToken()