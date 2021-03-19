import { remote } from "electron";
import type { OpenDialogReturnValue } from "electron/main";
import type { RpcProtoInfo } from "../../renderer/behaviour";
import { servicesStore } from "../../stores";
import faker from 'faker';
import { get } from "svelte/store";

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

    static stringify(message: any, indentSpace = 2): string {
        return JSON.stringify(message, null, indentSpace)
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
}


export class FakerUtil {
    static generateFakeJsonObject(object: { [key: string]: any }): Object {
        for (let key in object) {
            const value = object[key]
            if (typeof value === 'string') {
                object[key] = this.getStringValue(key, value)
            }
            else if (typeof value === 'boolean') {
                object[key] = faker.random.boolean()
            }
            else if (typeof value === 'number') {
                object[key] = this.getNumberValue(key, value)
            }

            else if (Array.isArray(value)) {
                for (let arrayIndex in value) {
                    const arrayItem = value[arrayIndex]
                    if (typeof arrayItem === 'string') {
                        value[arrayIndex] = this.getStringValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'boolean') {
                        value[arrayIndex] = faker.random.boolean()
                    }
                    else if (typeof arrayItem === 'number') {
                        value[arrayIndex] = this.getNumberValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'object') {
                        value[arrayIndex] = this.generateFakeJsonObject(arrayItem)
                    }
                }
            }

            else if (typeof value === 'object') {
                object[key] = this.generateFakeJsonObject(value)
            }
        }
        return object
    }

    private static getStringValue(key: string, value: string): string {
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

        }
        return value
    }

    private static getNumberValue(key: string, value: number): number {
        switch (key) {
            case 'age': return faker.random.number(100)
            case 'lat': return Number.parseFloat(faker.address.latitude())
            case 'long': return Number.parseFloat(faker.address.longitude())
            case 'rating': return faker.random.number(10)
            case 'year': return new Date().getFullYear()
            case 'month': return new Date().getMonth()
            case 'day': return new Date().getDay()
        }
        return faker.random.number(1000)
    }
}