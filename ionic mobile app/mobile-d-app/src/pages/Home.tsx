import { IonButton, IonCard, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import sha256 from 'sha256';
import chp from 'chainpoint-js/dist/bundle.web';
// import NodeRSA from 'node-rsa';
import forge from 'node-forge';
import {writeFileSync} from 'fs';


const Home: React.FC = () => {
  
  const [ID, setID] = useState<string>('')
  const [Attributes, setAttributes] = useState<string>('')
  const [Holder, setHolder] = useState<string>('')
  const [Verifier, setVerifier] = useState<string>('')
  const [Mode, setMode] = useState<string>('')
  const [checked, setChecked] = useState(false);

  let checkboxList = [
    { val: 'Family Name', isChecked: false },
    { val: 'Given Name', isChecked: false },
    { val: 'Birth Date', isChecked: false },
    { val: 'Issue date', isChecked: false }
  ];

  function Toggle(val_arg: string){
    let len = checkboxList.length
    let i = 0 
    while( i < len ){
      if(checkboxList[i].val == val_arg){
        checkboxList[i].isChecked ? checkboxList[i].isChecked = false : checkboxList[i].isChecked = true
      }
      i += 1
    }
  }

  const CreateJsonObject = async (ID: string, Attributes: string, Mode: string) =>{
    var empty: string[]
    empty = []

    var rsa = forge.pki.rsa;
    let keys_holder = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    let keys_verifier = rsa.generateKeyPair({bits: 2048, e: 0x10001});    
    
    var obj = {
      id: '',
      attributes: empty,
      holder_signature: '', //new ArrayBuffer(1024),
      verifier_signature: '', //new ArrayBuffer(1024),
      timestamp: Date.now(),
      mode: ''
    }

    obj.id = ID
    for (var a of Attributes.split(",")){
      obj.attributes.push(a)
    }
    var md1 = forge.md.sha1.create();
    md1.update(arrayToString(obj.attributes), 'utf8');
    obj.holder_signature = keys_holder.privateKey.sign(md1)
    var md2 = forge.md.sha1.create();
    md2.update(arrayToString(obj.attributes), 'utf8');
    obj.verifier_signature = keys_verifier.privateKey.sign(md2)
    obj.timestamp = Date.now()
    obj.mode = Mode 

    var json = JSON.stringify(obj);
    console.log(json)

    console.log('signature verification: ', 
                keys_holder.publicKey.verify(md1.digest().bytes(), obj.holder_signature),
                keys_verifier.publicKey.verify(md2.digest().bytes(), obj.verifier_signature))

    return sha256(json)
  }


  const SubmitToChainpoint = async (ID: string, Attributes: string, Holder: string, Verifier: string, Mode: string) =>{
    var hash = CreateJsonObject(ID, Attributes, Mode)
    // var hashes = []
    // hashes.push(hash)
    // console.log('Hash of file: ' + hashes)
    
    // let proofHandle = await chp.submitHashes(hashes)
    // console.log('Hash submitted: ' + proofHandle)

    // console.log('Sleeping 120 seconds (60 sec aggregation, 60 sec calendar) to wait for proofs to generate...')
    // await new Promise(resolve => setTimeout(resolve, 130000))

    // let proofs = await chp.getProofs(proofHandle)
    // console.log('Proof Objects: Expand objects below to inspect.')
    // console.log(proofs)

    // let verifiedProofs = await chp.verifyProofs(proofs)
    // console.log('Verified Proof Objects: Expand objects below to inspect.')
    // console.log(verifiedProofs)

    // // Wait 90 minutes for Bitcoin anchor proof, then run getProofs again
  } 

  async function SubmitToBlockchain() {
    let attributtes_string = ""
    console.log(checkboxList)
    checkboxList.map(({val, isChecked}) => 
      {
        console.log(isChecked)
        if(isChecked){
          attributtes_string = attributtes_string + val + ';'
        }
      }
    )
    console.log("Attributes string: " + attributtes_string)
    let hash = sha256(attributtes_string)
    let hashes = []
    hashes.push(hash)
    console.log('Hash of attributes: ' + hashes)

    let proofHandle = await chp.submitHashes(hashes)
    console.log('Hash submitted: ' + proofHandle)

    // Wait for Calendar proofs to be available
    console.log('Sleeping 120 seconds (60 sec aggregation, 60 sec calendar) to wait for proofs to generate...')
    await new Promise(resolve => setTimeout(resolve, 130000))

    // Retrieve a Calendar proof for each hash that was submitted
    // TODO: Fix this part, is not working 
    let proofs = await chp.getProofs(proofHandle)
    console.log('Proof Objects: Expand objects below to inspect.')
    console.log(proofs)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Verifier</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonList>
            <IonItem>
              <IonLabel>ID</IonLabel>
              <IonInput value={ID} placeholder='ID' onIonChange={(e:any) => setID(e.target.value)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Attributes</IonLabel>
              <IonInput value={Attributes} placeholder='Attributes' onIonChange={(e:any) => setAttributes(e.target.value)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Transaction Mode</IonLabel>
              <IonInput value={Mode} placeholder='Transaction Mode' onIonChange={(e:any) => setMode(e.target.value)}></IonInput>
            </IonItem>
          </IonList>
        </IonCard>
        <IonButton onClick={() => SubmitToChainpoint(ID, Attributes, Holder, Verifier, Mode)}>Submit</IonButton>

        <IonList>
          {checkboxList.map(({ val, isChecked }, i) => (
            <IonItem key={i}>
              <IonLabel>{val}</IonLabel>
              <IonCheckbox slot="end" value={val} checked={isChecked} onIonChange={() => Toggle(val)}/>
            </IonItem>
          ))}
        </IonList>
        <IonButton onClick={() => WriteToFile()}>Request Attributes</IonButton>
        <IonButton onClick={() => SubmitToBlockchain()}>Submit Toggled Attributes</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;

function arrayToString(message: string[]) {
  let m = ""
  for (let mm of message){
    m = m + mm
  }
  return m
}

function WriteToFile() {
  let text = "something"
}
