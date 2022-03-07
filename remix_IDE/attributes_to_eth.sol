pragma solidity ^0.4.18;

contract  Attributes{
    
   string uid;
   bool name;
   bool birthdate;
   bool email;
   bool height;
   string holder_pubkey;
   string verifier_pubkey;

   function SetAttributes(string _uid,
                          bool _name,
                          bool _birthdate,
                          bool _email,
                          bool _height,
                          string _holder_pubkey,
                          string _verifier_pubkey) public {
       uid = _uid;
       name = _name;
       birthdate = _birthdate;
       email = _email;
       height = _height;
       holder_pubkey = _holder_pubkey;
       verifier_pubkey = _verifier_pubkey;
   }
   
   function GetAttributes() public view returns (string,
                                                 bool, 
                                                 bool, 
                                                 bool, 
                                                 bool, 
                                                 string, 
                                                 string) {
        return (uid, name, birthdate, email, height, holder_pubkey, verifier_pubkey);
   }
    
}