import { IonButton, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import sha256File from 'sha256-file';
import chp from 'chainpoint-js';
// import fs from 'browserify-fs';

const Home: React.FC = () => {
  // const chp = require('chainpoint-js')
  // const fs = require('fs');
  
  const [ID, setID] = useState<string>('')
  const [Attributes, setAttributes] = useState<string>('')
  const [Holder, setHolder] = useState<string>('')
  const [Verifier, setVerifier] = useState<string>('')

  const CreateJsonFile = (ID: string, Attributes: string, Holder: string, Verifier: string) =>{
    // var fs = require('browserify-fs');
    var empty: string[]
    empty = []

    var obj = {
      id: '',
      attributes: empty,
      holder_pubkey: '',
      verifier_pubkey: '',
      holder_signature: '',
      verifier_signature: ''
    }

    obj.id = ID
    for (var a of Attributes.split(",")){
      obj.attributes.push(a)
    }
    obj.holder_pubkey = Holder
    obj.verifier_pubkey = Verifier
    obj.holder_signature = Holder
    obj.verifier_signature = Verifier

    var json = JSON.stringify(obj);
    console.log(json)
    // fs.writeFile('../../../../ex.json', json)
  }


  const SubmitToChainpoint = async () =>{
    var path_to_json = 'C:\\Users\\Luís\\Desktop\\LP\\uni\\tese\\thesis\\thesis\\chainpoint\\example.json'
    var hash = sha256File(path_to_json)
    var hashes = []
    hashes.push(hash)
    console.log('Hash of file: ' + hashes)

    let proofHandle = await chp.submitHashes(hashes)
    console.log('Hash submitted: ' + proofHandle)

    console.log('Sleeping 120 seconds (60 sec aggregation, 60 sec calendar) to wait for proofs to generate...')
    await new Promise(resolve => setTimeout(resolve, 130000))

    let proofs = await chp.getProofs(proofHandle)
    console.log('Proof Objects: Expand objects below to inspect.')
    console.log(proofs)

    let verifiedProofs = await chp.verifyProofs(proofs)
    console.log('Verified Proof Objects: Expand objects below to inspect.')
    console.log(verifiedProofs)

    // Wait 90 minutes for Bitcoin anchor proof, then run getProofs again
  } 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Write to Blockchain</IonTitle>
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
              <IonLabel>Holder Public Key</IonLabel>
              <IonInput value={Holder} placeholder='Holder Public Key' onIonChange={(e:any) => setHolder(e.target.value)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Verifier Public Key</IonLabel>
              <IonInput value={Verifier} placeholder='Verifier Public Key' onIonChange={(e:any) => setVerifier(e.target.value)}></IonInput>
            </IonItem>
          </IonList>
        </IonCard>
        <IonButton onClick={() => SubmitToChainpoint()}>Submit</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
