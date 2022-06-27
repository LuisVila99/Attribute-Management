import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import {Contract, EventData} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import ABI from '../services/abi.json';
import CryptoJS from 'crypto-js';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY!;

function encrypt(data: string) {
  var encrypted = CryptoJS.AES.encrypt(data, "Secret Passphrase");
  return encrypted
}

function decrypt (data: string){
  var decrypted = CryptoJS.AES.decrypt(data, "Secret Passphrase");
  return decrypted
}


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
        let cypher = encrypt(string_atts)
        console.log("Cypher: ", cypher.toString())
        let decypher = decrypt(cypher.toString())
        console.log("Decypher: ", decypher.toString(CryptoJS.enc.Utf8))
        let web3: Web3;
        let contract: Contract;
        web3 = new Web3(
            'wss://rinkeby.infura.io/ws/v3/83995bca05dd4af692b750a63416f60d'
        );
    

        contract = new web3.eth.Contract(
         ABI as AbiItem[],
         '0xCa820598345A94a0F2F4307c2f53d92D1a3144A1'
        );

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
            data: contract.methods.SetAttributes(arr[0]?.isChecked, 
                                                arr[1]?.isChecked,
                                                arr[2]?.isChecked, 
                                                arr[3]?.isChecked).encodeABI(),
            //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
          };
        }      
    
        return provider.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
    }

    static async getAttributes() {
        let web3: Web3;
        let contract: Contract;
        web3 = new Web3(
            'wss://rinkeby.infura.io/ws/v3/83995bca05dd4af692b750a63416f60d'
        );
    

        contract = new web3.eth.Contract(
         ABI as AbiItem[],
         '0xCa820598345A94a0F2F4307c2f53d92D1a3144A1'
        );

        const provider: any = await detectEthereumProvider();
    
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
    
        await provider.request({ method: 'eth_requestAccounts' });
    
        // const transactionParameters = {
        //   // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
        //   // gas: '0x2710', // customizable by user during MetaMask confirmation.
        //   to: contract.options.address, // Required except during contract publications.
        //   from: provider.selectedAddress, // must match user's active address.
        //   //value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        //   // Optional, but used for defining smart contract creation and interaction.
        console.log(contract.methods.GetAttributes().call())
        //   //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        // };
    
        // return provider.request({
        //   method: 'eth_sendTransaction',
        //   params: [transactionParameters],
        // });
    }
}

export default Blockchain;