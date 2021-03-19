import * as grpc from '@grpc/grpc-js'
import type { PackageDefinition } from '@grpc/grpc-js/build/src/make-client';

var PROTO_PATH = '/home/nateshmbhat/Desktop/tap-wire/static/sample/greeter-service.proto';

var protoLoader = require('@grpc/proto-loader');
var packageDefinition: PackageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var hello_world_package = grpc.loadPackageDefinition(packageDefinition);

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call: any, callback: any) {
  console.log('Request : ', call)
  callback(null, { message: 'Hello ' + call.request.name });
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
export function startDummyGrpcTargetServer({ port }: { port: number }) {
  var server = new grpc.Server();
  //@ts-ignore
  server.addService(hello_world_package.hello_world.Greeter['service'], { sayHello: sayHello });
  server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(error, port)
    }
    else {
      console.log('Dummy Grpc Test Server started at port : ', port)
      server.start();
    }
  });
}