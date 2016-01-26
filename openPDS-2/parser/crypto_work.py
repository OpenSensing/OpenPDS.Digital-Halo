from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.exceptions import InvalidTag
## Import keys


## Decryption

	
def decrypt (cyphertext_tagged, key):
	# key as bytes, AES-GCM  iv(12) + ct + tag (16)
	ctt     = cyphertext_tagged.decode('hex')
	iv      = ctt[:12]
	ct      = ctt[12:-16]
	tag     = ctt[-16:]

	aes_gcm   = Cipher(algorithms.AES(key), modes.GCM(iv, tag), backend=default_backend())
	decryptor = aes_gcm.decryptor()

	try:
		print decryptor.update(ct)+decryptor.finalize()
	except InvalidTag:
		print 'Decryption Failed! Authentication error - GCM tag not maching.'




##  Input 
def test_run():
	import sys

	aes_key    = 'aa8611956202d8e8618e4bf1dacaf00074c4883ce718409cf6a50fe1ee33d953'
	ct_and_tag = '0e17eb1cfb74848c24eae8db47a4ec4bfedf9e12af9274794641f0f65c2916f35399b0'
	
	print 'GCM decryption test intiated:'	
	try:
		decrypt(ct_and_tag, aes_key)
		
	except:
		print 'GCM Decryption Test Failed!', sys.exc_info() 

if __name__ == '__main__':
	test_run()
