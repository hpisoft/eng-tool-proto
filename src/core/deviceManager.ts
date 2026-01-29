// core/deviceManager.ts - VS Code independent device management

import { execSync } from 'child_process';

export interface Device {
  id: string;
  type: string;
  typeId: string;
  typeName: string;
}

export class DeviceManager {
  private devices: Device[] = [];

  constructor() {
    // start empty; call discoverDevices() to populate
    this.devices = [];
  }

  /**
   * Discover connected devices
   */
  async discoverDevices(): Promise<void> {
    try {
      // Query USB devices (excluding hubs with PNPClass="USB")
      const psCmd = `Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -like 'USB*' -and $_.PNPClass -ne 'USB' } | Select-Object InstanceId, Class, ClassGuid | ConvertTo-Json`;
      const cmd = `powershell -NoProfile -Command "${psCmd.replace(/"/g, '\\"')}"`;
      const stdout = execSync(cmd, { encoding: 'utf8' }).trim();

      if (!stdout) {
        console.log('[DeviceManager] No USB devices found');
        this.devices = [];
        return;
      }

      let parsed: any = JSON.parse(stdout);
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      this.devices = parsed.map((d: any) => {
        const devId = d.InstanceId || '';

        return {
          id: devId,
          type: d.Class || 'USB',
          typeId: d.ClassGuid || '',
          typeName: d.Class || 'USB'
        };
      });

      console.log('[DeviceManager] Discovered USB devices via Get-PnpDevice (PNPClass != USB):', this.devices.length);
    } catch (err) {
      console.error('[DeviceManager] discoverDevices failed:', err);
      this.devices = [];
    }
  }

  getOnlineDevices(): Device[] {
    return [...this.devices];
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find(device => device.id === id);
  }
}