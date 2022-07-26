pragma solidity ^0.4.18;

contract Attributes {

   struct Consentments {
      string cyphered_consents;
   }

   event UpdateConsentments(address owner);

   mapping (address => Consentments) AllConsentments;


   function SetAttributes(string cypher) public {
       emit UpdateConsentments(msg.sender);
       AllConsentments[msg.sender].cyphered_consents = cypher;
   }
   
   function GetAttributes() public view returns (string) {
        return (AllConsentments[msg.sender].cyphered_consents);
   }
}



// --------------------------------DUMP-------------------------------- \\
//    function GetAll() public view returns (string []) {
//       string[] memoryArray = new string[](AllUsers[msg.sender].size);
//       for(uint i = 0; i < AllUsers[msg.sender].size; i++){
//          memoryArray[i] = AllUsers[msg.sender].cyphered_consents[i];
//       }
//       return memoryArray;
//    }