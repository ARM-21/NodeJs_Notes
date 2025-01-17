## Http module is nodej is build upon the tcp or net module of the node js
* In net module there is a duplex stream whereas http readable stream and writable stream are seprated in (req(readable),res(writable))
** here new event is introduced which is not available in net module i.e. "request"

** we can listen same "connection" event over here but we need to write header and body manuaually using write() method
