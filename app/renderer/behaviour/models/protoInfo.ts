import type { MethodPayload } from "bloomrpc-mock-js";
// @ts-ignore
import * as lodashGet from "lodash.get";
import { Message, Service } from "protobufjs";
import { ProtoUtil } from "../../../commons/utils";
import { FakerUtil } from "../../../commons/utils/util";
import type { ProtoService } from "./models";

export class RpcProtoInfo {
  methodName: string;
  mockRequestPayloadString: string;
  mockResponsePayload: MethodPayload;
  mockRequestPayload: MethodPayload;
  mockRequestTemplate: MethodPayload;
  mockResponsePayloadString: string;
  mockResponseTemplate: MethodPayload;
  client: any;
  fullServiceName: string;
  shortServiceName: string;
  protoFileName: string;
  private serviceDef: Service;

  constructor(protoFileName: string, service: ProtoService, methodName: string) {
    this.methodName = methodName;
    this.protoFileName = protoFileName
    this.mockRequestTemplate = service.requestMocks[this.methodName]()
    this.mockResponseTemplate = service.responseMocks[this.methodName]()

    const requestPayload = FakerUtil.getNewMockJsonObject(this.mockRequestTemplate);
    this.mockRequestPayload = { message: new Message(requestPayload), plain: requestPayload }
    this.mockRequestPayloadString = ProtoUtil.stringify(this.mockRequestPayload.plain)

    const responsePayload = FakerUtil.getNewMockJsonObject(this.mockResponseTemplate);
    this.mockResponsePayload = { message: new Message(responsePayload), plain: responsePayload }
    this.mockResponsePayloadString = ProtoUtil.stringify(this.mockResponsePayload.plain)

    this.client = lodashGet(service.proto.ast, service.serviceName);
    this.serviceDef = service.proto.root.lookupService(service.serviceName);
    this.fullServiceName = service.serviceName
    this.shortServiceName = this.serviceDef.name
  }

  methodDef() {
    return this.serviceDef.methods[this.methodName];
  }

  isClientStreaming() {
    const method = this.methodDef();
    return method && method.requestStream;
  }

  isServerStreaming() {
    const method = this.methodDef();
    return method && method.responseStream;
  }

  isBiDirectionalStreaming() {
    return this.isClientStreaming() && this.isServerStreaming();
  }

  usesStream() {
    return this.isClientStreaming() || this.isServerStreaming();
  }
}
