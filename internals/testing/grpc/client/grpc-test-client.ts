var PROTO_PATH = __dirname + "/../protos/greeter-service.proto";

import {loadPackageDefinition , credentials } from '@grpc/grpc-js'
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var hello_proto = loadPackageDefinition(packageDefinition).helloworld;
console.log(JSON.stringify(hello_proto))

function main() {
  var client = new hello_proto['Greeter'](
    "localhost:50051",
    credentials.createInsecure()
  );
  var user;
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = "world";
  }
  client.sayHello({ name: user }, function (err, response) {
    console.log("Greeting:", response.message);
  });
}

main();

export {}