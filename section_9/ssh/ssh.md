we can connect to ssh server using
ssh user@host -p port

## we can also set ssh-keygen to connect to server without password

## ssh-keygen generates a public key and a private key
** public key is stored in the server
** private key is stored in the client

## we can connect to multiple servers using ssh config file
** ~/.ssh/config
** Host server1  --> alias
** HostName server1 --> ip address
** User user1 --> username
** Port 22 --> port number
** IdentityFile ~/.ssh/id_rsa --> private key