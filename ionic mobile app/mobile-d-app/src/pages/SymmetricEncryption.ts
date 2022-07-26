import CryptoJS from 'crypto-js';

export class SymmetricEncryption{

    constructor(){}

    static async encrypt(data: string, KEY: string) {
        var encrypted = CryptoJS.AES.encrypt(data, KEY);
        return encrypted.toString()
    }

    static async decrypt(data: string, KEY: string) {
        var decrypted = CryptoJS.AES.decrypt(data, KEY);
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
}


export default SymmetricEncryption;
