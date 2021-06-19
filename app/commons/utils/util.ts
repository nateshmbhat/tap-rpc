import { remote } from "electron";
import type { OpenDialogReturnValue } from "electron/main";
import { loadProtos, RpcProtoInfo } from "../../renderer/behaviour";
import { protoFilesStore, servicesStore } from "../../stores";
import faker, { random } from 'faker';
import { appConfigStore } from "../../stores/tabStore";
import { get } from "svelte/store";
import type { IncomingRequest, TabConfigModel } from "../../renderer/components/types/types";
import { Metadata } from "@grpc/grpc-js";
import type { MethodPayload } from "bloomrpc-mock-js";
import { randomInt } from "crypto";

export class ProtoUtil {
    static async getMethodRpc(serviceName: string, methodName: string): Promise<RpcProtoInfo> {
        const services = await servicesStore.getValue()
        return new Promise<RpcProtoInfo>((res, rej) => {
            const filteredServices = services.filter((service, index) => service.serviceName === serviceName)
            if (filteredServices.length == 0) {
                rej('could not find the service ' + serviceName)
                return
            }
            const selectedService = filteredServices[0]
            if (selectedService.methods[methodName]) {
                res(selectedService.methods[methodName])
            } else {
                rej('could not find any method with method name : ' + methodName)
            }
        })
    }

    static async getMethodRpcFromRequest(incomingRequest: IncomingRequest): Promise<RpcProtoInfo> {
        return this.getMethodRpc(incomingRequest.serviceName, incomingRequest.methodName)
    }

    static async loadProtoFilesAndStartServer(filePaths: string[], importPaths: string[]) {
        const protoFiles = get(protoFilesStore).map(pf => pf.proto.filePath)
        filePaths = filePaths.filter((fp) => protoFiles.indexOf(fp) < 0)
        if (filePaths.length == 0) return
        const uniqueProtoFilePaths = [...new Set([...filePaths, ...protoFiles])];
        const loadedProtoFiles = await loadProtos(uniqueProtoFilePaths, importPaths);
        protoFilesStore.addProtoFiles(loadedProtoFiles);
    }

    static stringify(message: any, indentSpace = 2): string {
        return JSON.stringify(message, null, indentSpace)
    }

    static getMetadataObject(metadataText: string): Metadata {
        const metadataJson = JSON.parse(metadataText)
        const metadataObject = new Metadata()

        Object.entries(metadataJson).forEach(([key, value]) => {
            metadataObject.add(key, value as string)
        })

        return metadataObject
    }
}

export class TabUtil {
    static async getTabConfigFromRpc(rpcProtoInfo: RpcProtoInfo): Promise<TabConfigModel | undefined> {
        const appConfig = get(appConfigStore)
        return appConfig.tabs.find((tabModel, index, allTabs) => {
            const rpc = tabModel.selectedRpc
            return rpc?.serviceName == rpcProtoInfo.serviceName && rpc.methodName == rpcProtoInfo.methodName
        })
    }
}


export class FileSystemUtil {
    static async getProtoFilesFromFilePicker(): Promise<OpenDialogReturnValue> {
        const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openFile', 'multiSelections'],
            buttonLabel: 'Import Proto',
            filters: [
                { name: 'Protos', extensions: ['proto'] },
            ]
        });
        return result;
    }

    static async getProtoResolvePathsFromFilePicker(): Promise<OpenDialogReturnValue> {
        const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory'],
            buttonLabel: 'Add Proto Path',
            filters: []
        });
        return result;
    }
}


export class FakerUtil {

    static getNewMockJsonObject(payloadTemplate: MethodPayload): Object {
        return this.generateMockJsonObject(payloadTemplate.plain)
    }

    private static generateMockJsonObject(object: { [key: string]: any }): Object {
        const result: { [key: string]: any } = {}
        for (let [key, value] of Object.entries(object)) {
            if (typeof value === 'string') {
                result[key] = this.getStringValue(key, value)
            }
            else if (typeof value === 'boolean') {
                result[key] = faker.random.boolean()
            }
            else if (typeof value === 'number') {
                result[key] = this.getNumberValue(key, value)
            }

            else if (Array.isArray(value) && value.length > 0) {
                const newArray = [...new Array(faker.random.number(4) + 1)].map(e => value[0])
                for (let arrayIndex in newArray) {
                    const arrayItem = newArray[arrayIndex]
                    if (typeof arrayItem === 'string') {
                        newArray[arrayIndex] = this.getStringValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'boolean') {
                        newArray[arrayIndex] = faker.random.boolean()
                    }
                    else if (typeof arrayItem === 'number') {
                        newArray[arrayIndex] = this.getNumberValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'object') {
                        const newArrayItem = this.generateMockJsonObject(arrayItem)
                        newArray[arrayIndex] = newArrayItem
                    }
                }
                result[key] = newArray
            }

            else if (typeof value === 'object') {
                result[key] = this.generateMockJsonObject(value)
            }
        }
        return result
    }

    //returns number when the value contains encoded enum values
    private static getStringValue(key: string, value: string): string | number {
        if (value.startsWith('taprpc_enum:')) {
            const enumRegex = RegExp(/^taprpc_enum:([\d-]+)$/)
            const regexResults = enumRegex.exec(value)
            if (regexResults === null) return 0
            const numberList = regexResults[1].split('-').map(n=>parseInt(n))
            return numberList[random.number(numberList.length-1)] 
        }
        key = key.trim().toLowerCase().replace(' ', '').replace('_', '')
        switch (key) {
            case 'zipcode': return faker.address.zipCode()
            case 'city': return faker.address.city()
            case 'state': return faker.address.state()
            case 'country': return faker.address.country()
            case 'countrycode': return faker.address.countryCode()
            case 'latitude': return faker.address.latitude()
            case 'longitude': return faker.address.longitude()
            case 'timeZone': return faker.address.timeZone()

            case 'homeaddress':
            case 'address':
            case 'shippingaddress':
            case 'houseaddress':
            case 'residenceaddress': return faker.address.streetAddress(true) + `, ${faker.address.city()}, ${faker.address.state()}`

            case 'color': return faker.commerce.color()
            case 'price': return faker.commerce.price()
            case 'department': return faker.commerce.department()

            case 'expirydate':
            case 'expiry':
            case 'expireson':
            case 'date': return faker.date.future().toString()

            case 'cost':
            case 'expenditure':
            case 'price': return faker.finance.amount()

            case 'cardnumber':
            case 'creditcardnumber':
            case 'creditcard':
            case 'debitcardnumber':
            case 'debitcard': return faker.finance.creditCardNumber()

            case 'cardcvv':
            case 'creditcardcvv':
            case 'cvvnumber':
            case 'cvvdigits':
            case 'cvv': return faker.finance.creditCardCVV()

            case 'currencycode': return faker.finance.currencyCode()

            case 'image':
            case 'iconurl':
            case 'thumbnail':
            case 'thumbnailimage':
            case 'thumbnailurl':
            case 'imageurl': return faker.random.image()

            case 'avatarimage': return faker.internet.avatar()

            case 'username': return faker.internet.userName()

            case 'useragent': return faker.internet.userAgent()
            case 'email': return faker.internet.email()

            case 'phonenumber':
            case 'mobile':
            case 'mobilenumber':
            case 'phone': return faker.phone.phoneNumber()

            case 'id':
            case 'uuid': return faker.random.uuid()

            case 'filename':
            case 'file': return faker.system.fileName()

            case 'filepath': return faker.system.filePath()

            case 'folder':
            case 'folderpath':
            case 'directorypath':
            case 'foldername': return faker.system.directoryPath()

            case 'firstname': return faker.name.firstName()
            case 'lastname': return faker.name.lastName()

            case 'jobtitle': return faker.name.jobTitle()
            case 'profession': return faker.name.jobTitle()
            case 'area': return faker.name.jobTitle()

            case 'sex':
            case 'gender': return faker.name.gender()

            case 'timestamp': return Date.now().toString()
            case 'name': return faker.name.findName()

            case 'description':
            case 'sentence': return faker.lorem.sentence()

            case 'message': return faker.lorem.sentences(faker.random.number(3) + 1)

            case 'storyline':
            case 'body': return faker.lorem.paragraph()
        }

        if (key.endsWith('id')) return faker.random.uuid()
        return faker.random.word()
    }

    private static getNumberValue(key: string, value: number): number {
        switch (key) {
            case 'age': return faker.random.number(100)
            case 'lat': return Number.parseFloat(faker.address.latitude())
            case 'long': return Number.parseFloat(faker.address.longitude())
            case 'rating': return faker.random.number(5)
            case 'year': return new Date().getFullYear()
            case 'month': return new Date().getMonth()
            case 'day': return new Date().getDay()
        }
        return faker.random.number(1000)
    }
}