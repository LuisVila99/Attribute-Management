import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-bootstrap';

const chp = require('chainpoint-js/dist/bundle.web')
const sha256File = require('sha256-file')

const sendData = async () =>{
  // var path_to_json = './example.json'
  // var hash = sha256File(path_to_json)
  var hash = '1d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a'
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

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Click the button to submit a hash to the blockchain</Text>
      <Button onClick={sendData}>
        Submit
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
