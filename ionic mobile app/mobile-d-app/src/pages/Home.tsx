import { IonButton, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import sha256 from 'sha256';
import chp from 'chainpoint-js/dist/bundle.web';



const Home: React.FC = () => {
  
  const [ID, setID] = useState<string>('')
  const [Attributes, setAttributes] = useState<string>('')
  const [Holder, setHolder] = useState<string>('')
  const [Verifier, setVerifier] = useState<string>('')

  const CreateJsonObject = (ID: string, Attributes: string, Holder: string, Verifier: string) =>{
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
    console.log(sha256(json))
    return sha256(json)
  }


  const SubmitToChainpoint = async (ID: string, Attributes: string, Holder: string, Verifier: string) =>{
    var hash = CreateJsonObject(ID, Attributes, Holder, Verifier)
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
        <IonButton onClick={() => SubmitToChainpoint(ID, Attributes, Holder, Verifier)}>Submit</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
