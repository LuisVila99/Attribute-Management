import { IonButton, IonInput, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import './Home.css';
import Blockchain from './Blockchain'


const Home: React.FC = () => {
  
  const [TransactionHash, setTransactionHash] = useState<string>('')
 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Holder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
            <IonLabel>Transaction Hash</IonLabel>
            <IonInput value={TransactionHash} 
                      placeholder="Transaction Hash"
                      onIonChange={(e:any) => setTransactionHash(e.target.value)}></IonInput>
        </IonItem>
        <IonButton onClick={() => Blockchain.getAttributesPerTransaction(TransactionHash)}>See Transaction</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;