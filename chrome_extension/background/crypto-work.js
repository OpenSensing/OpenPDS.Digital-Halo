var randomVector = new Uint8Array(12);
var randomVector = crypto.getRandomValues(randomVector);

var algoIdKey    = {name: 'AES-GCM', length:256};
var algoIdCrypt  = {name: 'AES-GCM', iv:randomVector, tagLength: 128}

var encoder      = new TextEncoder('utf-8');
var decoder      = new TextDecoder('utf-8');

//AES-CBC with HMAC

function ch () {
crypto.subtle.generateKey(
	algoIdKey, 										//
	true, 
	['encrypt', 'decrypt']
)
.then(function(aesKey) {
	crypto.subtle.exportKey('raw', aesKey
	).then(sendAESKey
	).catch(function (e) {console.log('while sending AES key: '+e)});
	
	return crypto.subtle.encrypt(
		algoIdCrypt, 
		aesKey, 
		encoder.encode('XXzzzzY'))
})
.then(function (ct) {	  

  sendTaggedCT(randomVector, ct)

})
.catch(function (e) {console.log('E while encrypting: '+e)})

}

// helper functions

function sendAESKey (aesKeyBuffer) {
	console.log('AES key: ' + HexDecode(aesKeyBuffer))
}


function sendTaggedCT (iv, ct) {
	ct   = HexDecode(appendArrayBuffer(iv, ct));
 

	console.log('Tagged CT:')
	console.log('ct=' + ct);
}


function appendArrayBuffer (ab1, ab2) {
  var res = new Uint8Array(ab1.byteLength + ab2.byteLength);
  res.set(ab1);
  res.set(new Uint8Array(ab2), ab1.byteLength);
  return res
}

function HexEncode (hexStr) {
  if (hexStr.length % 2 != 0) throw Error('Uneven number of symbols - not a proper hex byte string'); 
  var byteLength = hexStr.length /2; 
  var resultByteArrayBuffer = new Uint8Array(byteLength); 

  for (var i=0; i<byteLength; i++) {
    resultByteArrayBuffer[i] = parseInt(hexStr.substr(i*2, 2), 16)
  };
  return resultByteArrayBuffer 
}

function HexDecode (hexABuffer) {
  var bufferView = new Uint8Array(hexABuffer);
  var resultHexString= '';
  var currentByte;

  for (el in bufferView) {
    currentByte = bufferView[el].toString(16);
    currentByte.length < 2 ? resultHexString += '0' + currentByte : resultHexString += currentByte;
  }
  return resultHexString;
}
	