import { networkInterfaces } from 'os'

export class NetworkUtil {
    static getLocalIp() : string {
        const nets = networkInterfaces();
        const possibleIps :string[]= []
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    possibleIps.push(net.address);
                }
            }
        }
        const localIps = possibleIps.filter((ip)=>ip.startsWith('192.168') || ip.startsWith('172.16') || ip.startsWith('10.0.0'))
        if(localIps.length>0) return localIps[0]
        return ''
    }
}
