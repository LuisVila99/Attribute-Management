import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import {Contract, EventData} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import ABI from '../services/abi.json';
import Encryption from './Encryption';
import SymmetricEncryption from './SymmetricEncryption';
import InputDataDecoder from 'ethereum-input-data-decoder';
import { time } from 'console';

let web3: Web3;
let contract: Contract;
let decoder = new InputDataDecoder(ABI);


web3 = new Web3(
    'https://goerli.infura.io/v3/e2256592c3cf4126a5dc339cd4964355'
);

contract = new web3.eth.Contract(
  ABI as AbiItem[],
  '0xcd3F090E82aE84e3F46e253cF0877aD4c2c5222B'
);


function arrayToString(message: any[], entity: string) {
  let m = "|"
  for (let mm of message){
    m = m + mm.val + ':' + mm.isChecked + '|'
  }
  m = m + 'Entity:' + entity + '|';
  return m
}


export class Blockchain{

    constructor(){}


    static async setAttributes(arr: any[], password="", entity="<PSP_ID>"): Promise<string> {
      let string_atts = arrayToString(arr, entity)
      console.log("ARR: ", string_atts)
      let cypher = await SymmetricEncryption.encrypt(string_atts, password)
      console.log("Cypher: ", cypher)
      const provider: any = await detectEthereumProvider();
  
      if (!provider) {
        throw new Error('Please install MetaMask');
      }
  
      await provider.request({ method: 'eth_requestAccounts' });
      
      let transactionParameters = undefined
      if(arr != undefined){
        transactionParameters = {
          // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
          to: contract.options.address, // Required except during contract publications.
          from: provider.selectedAddress, // must match user's active address.
          //value: '0x00', // Only required to send ether to the recipient from the initiating external account.
          // Optional, but used for defining smart contract creation and interaction.
          data: contract.methods.SetAttributes(cypher).encodeABI(),
          //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
      }      
      console.log("Parameters: ", transactionParameters)
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
        
      let transactionParameters = undefined
      transactionParameters = {
        // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
        // gas: '0x2710', // customizable by user during MetaMask confirmation.
        to: contract.options.address, // Required except during contract publications.
        from: provider.selectedAddress.address, // must match user's active address.
        //value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        // Optional, but used for defining smart contract creation and interaction.
        data: contract.methods.GetAttributes().encodeABI(),
        //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };    

      console.log("Parameters: ", transactionParameters)
      let cypher = await contract.methods.GetAttributes().call({to:contract.options.address,from:provider.selectedAddress})
      console.log("Cypher from get: ", cypher)
      let decypher = await SymmetricEncryption.decrypt(cypher, "password")
      console.log("Decypher: ", decypher)
      return decypher
    }

    static async getTransactionsOfAccount() {
        const provider: any = await detectEthereumProvider();
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
        await provider.request({ method: 'eth_requestAccounts' });
        let contract = "0x92939837c37cd92d4f52e805584b3168a278211f"
        console.log("starting")
        // web3.eth.getPastLogs({address:contract})
        // .then(res => {
        //   console.log("res: ", res)
        //   res.forEach(rec => {
        //     console.log(rec.blockNumber, rec.transactionHash, rec.topics);
        //   });
        // }).catch(err => console.log("getPastLogs failed", err));
        console.log("ending")
    }


    static async getAttributesPerTransaction(transaction: string, password: string) {
      const provider: any = await detectEthereumProvider();
  
      if (!provider) {
        throw new Error('Please install MetaMask');
      }
  
      await provider.request({ method: 'eth_requestAccounts' });
  

      let txHash = transaction
      let tx = await web3.eth.getTransaction(txHash, (error, txResult) => {
        const input = decoder.decodeData(txResult.input);
        console.log("Input: ", input);
        let decypher = SymmetricEncryption.decrypt(input.inputs[0], password) 
        console.log("Attributes consented in transaction: ", decypher)
      });
      let block = tx.blockNumber
      if(block){
        web3.eth.getBlock(block, (error, timestamp) => {
          console.log("Timestamp: ", timestamp.timestamp)
        })
      }
      else{
        console.log("No block number found")
      }
    }

    static async eventsListener(){
      contract.events.UpdateConsentments()
      .on('data', (event: any) => {
          console.log(event);
      })
      .on('error', console.error);
    }

    static async getPastEvents(){
      console.log(await contract.getPastEvents("UpdateConsentments", {fromBlock: 0}));
    }

    static async getPastEventsPerAddress(address: string){
      console.log(await web3.eth.getPastLogs({fromBlock: 1, address: address}));
    }
}

export default Blockchain;