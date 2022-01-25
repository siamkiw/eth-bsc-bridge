const TokenEth = artifacts.require('./TokenEth.sol');

module.exports = async done => {
  const [admin, _] = await web3.eth.getAccounts();
  const tokenEth = await TokenEth.deployed();
  console.log('admin : ', admin)
  console.log('_ : ', _)
  const res = await tokenEth.mint(admin, 1000)
  console.log('res : ', res)
//   console.log(balance.toString());
  done();
}
