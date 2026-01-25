"use strict";
// core/deviceManager.ts - VS Code independent device management
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceManager = void 0;
class DeviceManager {
    constructor() {
        this.devices = [];
        // Initialize with sample devices for now
        this.devices = [
            { id: 'dev1', type: 'Sensor', path: '/dev/sensor1' },
            { id: 'dev2', type: 'Actuator', path: '/dev/actuator1' },
            { id: 'dev3', type: 'Controller', path: '/dev/controller1' }
        ];
    }
    getOnlineDevices() {
        return [...this.devices];
    }
    getDeviceById(id) {
        return this.devices.find(device => device.id === id);
    }
}
exports.DeviceManager = DeviceManager;
//# sourceMappingURL=deviceManager.js.map