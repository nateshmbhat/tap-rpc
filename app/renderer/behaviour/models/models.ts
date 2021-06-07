import type { ServiceDefinition } from '@grpc/grpc-js';
import type { Proto, ServiceMethodsPayload } from 'bloomrpc-mock-js';
import type { RpcProtoInfo } from '.';
import type { ResponseMetaInformation } from '..';

export interface ProtoFile {
  proto: Proto,
  fileName: string
  services: ProtoServiceList;
}

export interface ProtoServiceList {
  [key: string]: ProtoService,
}

export interface ProtoService {
  proto: Proto,
  serviceName: string,
  serviceDefinition: ServiceDefinition,
  requestMocks: ServiceMethodsPayload,
  responseMocks: ServiceMethodsPayload,
  methods: { [key: string]: RpcProtoInfo }
}

export interface ResponseError {
  code: number;
  details: string;
  message: string;
}

export interface ResponseInfo {
  isStreaming: boolean;
  data: Object;
  metaInfo: ResponseMetaInformation;
  error?: ResponseError
}