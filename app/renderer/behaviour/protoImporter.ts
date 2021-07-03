import { fromFileName, mockRequestMethods, mockResponseMethods, Proto, walkServices } from 'bloomrpc-mock-js';
import * as path from "path";
import type { ProtoFile, ProtoService } from './models/models';
import type { Service } from 'protobufjs';
import type { ServiceDefinition } from '@grpc/grpc-js';
import fs from 'fs'
import { RpcProtoInfo } from './models';
import { FileSystemUtil } from '../../commons/utils/util';

const commonProtosPath = [
  // @ts-ignore
  path.join(__STATIC_PATH__),
  // @ts-ignore
  path.join(__STATIC_PATH__, '/home/nateshmbhat/Desktop/bloomrpc-svelte/static/sample/'),
];


/**
 * Upload protofiles
 * @param onProtoUploaded
 * @param importPaths
 */
export async function loadProtoFilesFromFilePicker(importPaths?: string[]): Promise<ProtoFile[]> {
  const result = await FileSystemUtil.getProtoFilesFromFilePicker();
  if (result.canceled) return []
  return await loadProtos(result.filePaths, importPaths);
}

/**
 * Load protocol buffer files
 * @param filePaths
 * @param importPaths
 * @param onProtoUploaded
 */
//Throws Error when not able to load proto file
export async function loadProtos(filePaths: string[], importPaths?: string[]): Promise<ProtoFile[]> {
  const protos = await Promise.all(filePaths.filter((filePath) =>
    fs.existsSync(filePath)
  ).map((fileName) =>
    fromFileName(fileName, [
      ...(importPaths ? importPaths : []),
      ...commonProtosPath,
    ])
  ));

  const protoList = protos.reduce((list: ProtoFile[], proto: Proto) => {
    // Services with methods
    const services = parseServices(proto);

    // Proto file
    list.push({
      proto,
      fileName: proto.fileName.split(path.sep).pop() || "",
      services,
    });

    return list;
  }, []);
  return protoList;
}

/**
 * Parse Grpc services from root
 * @param proto
 */
function parseServices(proto: Proto) {
  const services: { [key: string]: ProtoService } = {};
  walkServices(proto, (service: Service, serviceClientImpl: any, serviceName: string) => {
    const requestMocks = mockRequestMethods(service);
    const responseMocks = mockResponseMethods(service);
    const serviceDefinition = serviceClientImpl.service

    const serviceObject: ProtoService = {
      serviceName: serviceName,
      proto,
      serviceDefinition: serviceDefinition,
      requestMocks: requestMocks,
      responseMocks: responseMocks,
      methods: {}
    };

    const serviceMethods: { [key: string]: RpcProtoInfo } = {}
    Object.keys(requestMocks)
      .forEach(methodName => serviceMethods[methodName] = new RpcProtoInfo(proto.fileName, serviceObject, methodName))
    serviceObject.methods = serviceMethods
    services[serviceName] = serviceObject
  });

  return services;
}

export async function loadProtoResolvePathFromFilePicker(): Promise<string[]> {
  const result = await FileSystemUtil.getProtoResolvePathsFromFilePicker()
  if (result.canceled) return []
  else return result.filePaths
}
