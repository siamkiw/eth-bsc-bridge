const BridgeEth = artifacts.require('./BridgeEth.sol');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  console.log("send : 10 token")
  await bridgeEth.burn(recipient, 10);
  done();
}
