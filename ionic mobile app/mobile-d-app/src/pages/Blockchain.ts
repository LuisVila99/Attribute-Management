import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import {Contract, EventData} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import ABI from '../services/abi.json';
import Encryption from './Encryption';
import InputDataDecoder from 'ethereum-input-data-decoder';

let web3: Web3;
let contract: Contract;
let decoder = new InputDataDecoder(ABI);


web3 = new Web3(
    'wss://rinkeby.infura.io/ws/v3/83995bca05dd4af692b750a63416f60d'
);

contract = new web3.eth.Contract(
  ABI as AbiItem[],
  '0x380FD1ADCa44dBd9FE25DFF2C19426e99E96696a'
);


function arrayToString(message: any[]) {
  let m = "|"
  for (let mm of message){
    m = m + mm.val + ':' + mm.isChecked + '|'
  }
  return m
}


export class Blockchain{

    constructor(){}

    static async setAttributes(arr: any[]): Promise<string> {
        let string_atts = arrayToString(arr)
        console.log("ARR: ", string_atts)
        const {publicKey, privateKey } = await Encryption.GetKeys();
        console.log(publicKey, privateKey)
        let cypher = await Encryption.Encrypt(string_atts, publicKey)
        console.log("Cypher: ", cypher)
        let decypher = await Encryption.Decrypt(cypher, privateKey)
        console.log("Decypher: ", decypher)

        const provider: any = await detectEthereumProvider();
    
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
    
        await provider.request({ method: 'eth_requestAccounts' });
        
        let transactionParameters = undefined
        if(arr != undefined && arr.length == 4){
          transactionParameters = {
            // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
            // gas: '0x2710', // customizable by user during MetaMask confirmation.
            to: contract.options.address, // Required except during contract publications.
            from: provider.selectedAddress, // must match user's active address.
            //value: '0x00', // Only required to send ether to the recipient from the initiating external account.
            // Optional, but used for defining smart contract creation and interaction.
            data: contract.methods.SetAttributes(cypher).encodeABI(),
            //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
          };
        }      
    
        return await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        })
    }

    static async getAttributes() {
        const provider: any = await detectEthereumProvider();
    
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
    
        await provider.request({ method: 'eth_requestAccounts' });
    

        let txHash = "0xcdb1ff653d8a760743714ca0ccab90d87d44e9e5e851abe92ce51e2db5f5c3f0"
        web3.eth.getTransaction(txHash, (error, txResult) => {
          const result = decoder.decodeData(txResult.input);
          console.log(result);
        });
    }

    static async getAttributesPerTransaction(transaction: string) {
      const provider: any = await detectEthereumProvider();
  
      if (!provider) {
        throw new Error('Please install MetaMask');
      }
  
      await provider.request({ method: 'eth_requestAccounts' });
  

      let txHash = transaction
      web3.eth.getTransaction(txHash, (error, txResult) => {
        const result = decoder.decodeData(txResult.input);
        console.log(result);
      });
  }
}

export default Blockchain;