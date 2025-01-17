import http from "node:http";

const server = http.createServer((request, response) => {
  console.log(request.method);
  response.setHeader("Content-Length", "23");
  response.write("Hello from http server.");
  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  //   response.end();
});

// server.on("request", (request, response) => {
//   console.log("Got the request");
//   response.setHeader("Content-Length", "23");
//   response.write("Hello from http server.");
//   //   response.end();
// });

// server.on("connection", (socket) => {
//   socket.on("data", (chunk) => {
//     console.log(chunk.toString());
//   });
//   socket.end("HTTP/1.1 200 OK\n\nHii from http server");
// });

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started");
});
