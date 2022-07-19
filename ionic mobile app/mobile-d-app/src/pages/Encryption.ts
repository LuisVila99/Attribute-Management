export class Encryption{

  constructor(){} 

  static async GetKeys(){
      return window.crypto.subtle.generateKey(
          {
              name: "RSA-OAEP",
              modulusLength: 2048, // can be 1024, 2048 or 4096
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: {name: "SHA-256"} // or SHA-512
          },
          true,
          ["encrypt", "decrypt"]
      )
  }

  static async Encrypt(msg: string, pub: any){
      var enc = new TextEncoder();
      return window.crypto.subtle.encrypt(
          {
            name: "RSA-OAEP"
          },
          pub,
          enc.encode(msg)
        );
  }

  static async Decrypt(msg: Uint8Array, priv: any){
      var enc = new TextDecoder();
      return enc.decode(await window.crypto.subtle.decrypt(
          {
            name: "RSA-OAEP"
          },
          priv,
          msg
        ));
  }
}

export default Encryption;
