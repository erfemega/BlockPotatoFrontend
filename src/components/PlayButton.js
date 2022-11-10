import {ethers} from 'ethers';

const PlayButton = ({ signerContract, currentAccount, onPlay }) => {

  const handlePlay = async () => {
    const nftBalanceBeforePlay = await signerContract.getAddressNfts(currentAccount);
    await signerContract.play({value: ethers.utils.parseEther('0.0001')});
    const nftBalanceAfterPlay = await signerContract.getAddressNfts(currentAccount);
    if (nftBalanceAfterPlay > nftBalanceBeforePlay) {
      return 'You win a potato';
    }
    return 'Ohh, You lose =(';
  }

  return (
    <button onClick={handlePlay}>
      Play a game!
    </button>
  )
}

export default PlayButton;