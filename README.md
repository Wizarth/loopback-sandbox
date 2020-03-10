# Remote change-stream causes zombie 'after save' handlers

In separate shells
* NODE_ENV=backend node server/server.js
* NODE_ENV=frontend node server/server.js
* node test.js

## Explanation

backend is on localhost:3000  
frontend is on localhost:3010  

backend is using in-memory db for Test model.  
frontend is using loopback-connector-remote, connecting to backend, for Test model.

server.js has a once per second check for the # of \_observers['after save'] on the Test model.  

test.js runs two tests. The first connects 100 times to http://localhost:3000/api/Tests/change-stream (using request). After ten seconds, these requests are aborted.  

During this time, the backend loopback instance reports 100 after save observers. When the requests are disconnected, the number of observers drops to zero.  

In the second test, 100 connections to http://localhost:3010/api/Tests/change-stream are created (the frontend). After ten seconds, these requests are aborted.  

During this time, the backend loopback instance reports 100 after save observers. When the requests are disconnected, the number of observers does not drop.  

Terminating the frontend instance does not cause the number of observers to drop.  
