const chp = require('chainpoint-js')
const sha256File = require('sha256-file')

async function run(path_to_json){
    hash = sha256File(path_to_json)
    hashes = []
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

run('./example.json')