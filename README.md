<p align="center">
  <img src="resources/icon.png" width="250px">
</p>
<h2 align="center">The Tool That Completes GRPC  </h2>
<br/>

[![](https://img.shields.io/badge/package-npm-blue)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/github/license/nateshmbhat/tap-rpc)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/github/languages/code-size/nateshmbhat/tap-rpc)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/badge/platform-mac,linux,windows-darkgreen)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fnateshmbhat%2Ftap-rpc)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fnateshmbhat%2Ftap-rpc)

**Tap Rpc** is a tool that aids in proto based dynamic generation of **mock server**, real time **request/response editor** and provides **client** to significantly speed up work for all of frontend, backend and testers.

## Features

### **Tap Rpc** provides 3 modes of operation :

### **Mock Rpc** mode :

- Automatically setup mock response server by loading proto file
- Generates convincing mock responses based on the properties in the proto
- Supports loading multiple proto files with multiple services and rpcs
- Edit values of generated mock responses based on your need

### **Monitor** mode :

- Monitor requests and responses by acting as the middle man between a grpc client and server
- Edit requests in real time before it reaches the backend server
- Edit response in real time before it reaches back the client

### **Client** mode :
- Test your backend services independently with this client
- Generates convincing Mock Request objects for quick rpc calls
