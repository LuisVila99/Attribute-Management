import CryptoJS from 'crypto-js';

export class SymmetricEncryption{

    constructor(){}

    static async encrypt(data: string, KEY: string) {
        var signed = CryptoJS.HmacSHA256(data, KEY)
        data = data + "signature:" + signed.toString() + "|"
        console.log("data: ", data)
        var encrypted = CryptoJS.AES.encrypt(data, KEY)
        return encrypted.toString()
    }

    static async decrypt(data: string, KEY: string) {
        var decrypted = CryptoJS.AES.decrypt(data, KEY);
        let dec_str = decrypted.toString(CryptoJS.enc.Utf8)
        var rx = /(.*)signature:(.*)\|/g
        let arr = rx.exec(dec_str)
        console.log(arr)
        let dec_data = arr![1]
        let signature = arr![2]
        console.log("Signature: ", signature)
        if (signature == CryptoJS.HmacSHA256(dec_data, KEY).toString()){
            console.log("Valid signature!")
            return decrypted.toString(CryptoJS.enc.Utf8)
        }
        console.log("Invalid signature!")
        return data
    }
}


export default SymmetricEncryption;
