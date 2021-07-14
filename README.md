<p align="center">
  <img src="resources/icon.png" width="250px">
</p>
<h2 align="center">The Tool That Completes GRPC  </h2>
<br/>

[![](https://img.shields.io/badge/package-npm-blue)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/github/license/nateshmbhat/tap-rpc)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/github/languages/code-size/nateshmbhat/tap-rpc)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/badge/platform-mac,linux,windows-darkgreen)](https://github.com/nateshmbhat/tap-rpc)
[![](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fnateshmbhat%2Ftap-rpc)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fnateshmbhat%2Ftap-rpc)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-BADGE:END -->

**Tap Rpc** is a tool that aids in proto based dynamic generation of : 
- A **mock server** that sends realistic auto generated mock responses (which can be customized).
- **Realtime modification of request and responses**. Modify requests from client before it reaches server and modify response from server before it reaches client.
- Provides grpc **client** to send auto generated mock requests to your services.

Tap-Rpc aims to significantly ease the development and testing efforts for all of frontend, backend devs and also testers.

## 🔖📑 [Read the Medium Article on TAP-RPC here](https://medium.com/geekculture/complete-your-grpc-development-and-testing-workflow-with-tap-rpc-bc185a1adce5) ✨

## Installation and Usage :

- Download the latest release from here : https://github.com/nateshmbhat/tap-rpc/releases

- In your client app, set the host and port for the grpc service to point to the Tap-Rpc’s ip address and port shown at the middle of the Tap-Rpc window title.
- Set the default target server URL, which is needed for the monitor and client modes.
- User selects the proto files containing the services. Once you select proto files, all the services and Rpcs in those services appear in a tree structure and you can select a particular rpc.
- At this point any requests coming from the client will be forwarded to the default target server in the background.
- Now your client app is ready to access all the features of Tap-Rpc.


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



## Contributors :
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://manukj.github.io/"><img src="https://avatars.githubusercontent.com/u/22499119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Manu </b></sub></a><br /><a href="#design-manukj" title="Design">🎨</a> <a href="https://github.com/nateshmbhat/tap-rpc/commits?author=manukj" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/shreyakishore"><img src="https://avatars.githubusercontent.com/u/29401486?v=4?s=100" width="100px;" alt=""/><br /><sub><b>shreyakishore</b></sub></a><br /><a href="https://github.com/nateshmbhat/tap-rpc/commits?author=shreyakishore" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sahanaprasad"><img src="https://avatars.githubusercontent.com/u/42026982?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sahana Prasad</b></sub></a><br /><a href="https://github.com/nateshmbhat/tap-rpc/commits?author=sahanaprasad" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
