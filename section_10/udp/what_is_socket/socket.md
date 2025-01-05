Note:- there are sockets in each udp and tcp
we use tcp socket while making chat application which is a "socket.io"

socket are build upon event emitters so we can listen to events and emit events
.on() is used to listen to events
.send() is used to send messages to udp server

.bind() is used to bind the socket to a port which acts as a server.

what is socket?
- socket is an endpoint of a two way communication link between two programs running on the network.    
- socket object holds the information required to establish connection between two programs i.e. ip address and port number.
.on('listening',(msg, remote)=>{
    remote object contains the address and port of the remote server
}) 


////////////////////////////////////////
import dgram from 'dgram';
const socket = dgram.createSocket('udp4');
socket object holds the information of both the server and client.
but we cann't use the socket object to get remote address and port without making connection to the server.
but after connection is established we can get the remote address from on('message') event.