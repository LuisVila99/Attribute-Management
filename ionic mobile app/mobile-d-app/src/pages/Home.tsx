import { IonButton, IonCheckbox, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import './Home.css';
import Blockchain from './Blockchain'


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


  const SubmitToChainpoint = async (ID: string, Attributes: string, Holder: string, Verifier: string, Mode: string) =>{
  //   var hash = CreateJsonObject(ID, Attributes, Mode)
  //   var hashes = []
  //   hashes.push(hash)
  //   console.log('Hash of file: ' + hashes)
    
  //   let proofHandle = await chp.submitHashes(hashes)
  //   console.log('Hash submitted: ' + proofHandle)

  //   console.log('Sleeping 120 seconds (60 sec aggregation, 60 sec calendar) to wait for proofs to generate...')
  //   await new Promise(resolve => setTimeout(resolve, 130000))

  //   let proofs = await chp.getProofs(proofHandle)
  //   console.log('Proof Objects: Expand objects below to inspect.')
  //   console.log(proofs)

  //   let verifiedProofs = await chp.verifyProofs(proofs)
  //   console.log('Verified Proof Objects: Expand objects below to inspect.')
  //   console.log(verifiedProofs)

  //   // // Wait 90 minutes for Bitcoin anchor proof, then run getProofs again
  } 


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Holder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {checkboxList.map(({ val, isChecked }, i) => (
            <IonItem key={i}>
              <IonLabel>{val}</IonLabel>
              <IonCheckbox slot="end" value={val} checked={isChecked} onIonChange={() => Toggle(val)}/>
            </IonItem>
          ))}
        </IonList>
        <IonButton onClick={() => Blockchain.setAttributes(checkboxList)}>Submit Toggled Attributes</IonButton>
        <IonButton onClick={() => Blockchain.getAttributes()}>See Attributes</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;