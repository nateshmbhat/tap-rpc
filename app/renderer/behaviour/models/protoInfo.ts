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
  mockResponsePayloadString: string;
  client: any;
  serviceName: string;
  private serviceDef: Service;

  constructor(service: ProtoService, methodName: string) {
    this.methodName = methodName;
    const requestPayload = FakerUtil.generateFakeJsonObject(service.requestMocks[this.methodName]().plain);
    this.mockRequestPayload = { message: new Message(requestPayload), plain: requestPayload }
    this.mockRequestPayloadString = ProtoUtil.stringify(this.mockRequestPayload.plain)
    const responsePayload = FakerUtil.generateFakeJsonObject(service.responseMocks[this.methodName]().plain);
    this.mockResponsePayload = { message: new Message(responsePayload), plain: responsePayload }
    this.mockResponsePayloadString = ProtoUtil.stringify(this.mockResponsePayload.plain)
    this.client = lodashGet(service.proto.ast, service.serviceName);
    this.serviceDef = service.proto.root.lookupService(service.serviceName);
    this.serviceName = this.serviceDef.name
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
