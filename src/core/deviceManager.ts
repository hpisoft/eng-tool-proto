// core/deviceManager.ts - VS Code independent device management

export interface Device {
  id: string;
  type: string;
  path: string;
}

export class DeviceManager {
  private devices: Device[] = [];

  constructor() {
    // Initialize with sample devices for now
    this.devices = [
      { id: 'dev1', type: 'Sensor', path: '/dev/sensor1' },
      { id: 'dev2', type: 'Actuator', path: '/dev/actuator1' },
      { id: 'dev3', type: 'Controller', path: '/dev/controller1' }
    ];
  }

  getOnlineDevices(): Device[] {
    return [...this.devices];
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find(device => device.id === id);
  }
}