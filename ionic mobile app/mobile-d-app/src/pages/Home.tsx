import { IonButton, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const [ID, setID] = useState<string>('')
  const [Attributes, setAttributes] = useState<string>('')
  const [Holder, setHolder] = useState<string>('')
  const [Verifier, setVerifier] = useState<string>('')


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
        <IonButton onClick={() => console.log(ID, Attributes, Holder, Verifier)}>Submit</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
