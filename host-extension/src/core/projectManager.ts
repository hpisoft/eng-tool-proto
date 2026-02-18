import { Device } from './deviceManager';

export interface Project {
  name: string;
  devices: Device[];
}

export class ProjectManager {
  private currentProject: Project | null = null;

  createProject(name: string): Project {
    this.currentProject = { name, devices: [] };
    return this.currentProject;
  }

  getCurrentProject(): Project | null {
    return this.currentProject;
  }

  addDeviceToProject(device: Device): boolean {
    if (!this.currentProject) {
      return false;
    }
    if (!this.currentProject.devices.find(d => d.id === device.id)) {
      this.currentProject.devices.push(device);
      return true;
    }
    return false;
  }

  removeDeviceFromProject(deviceId: string): boolean {
    if (!this.currentProject) {
      return false;
    }
    const index = this.currentProject.devices.findIndex(d => d.id === deviceId);
    if (index > -1) {
      this.currentProject.devices.splice(index, 1);
      return true;
    }
    return false;
  }

  closeProject(): void {
    this.currentProject = null;
  }

  saveProject(): string | null {
    if (!this.currentProject) {
      return null;
    }
    return JSON.stringify(this.currentProject, null, 2);
  }

  loadProject(data: string): boolean {
    try {
      const project = JSON.parse(data) as Project;
      this.currentProject = project;
      return true;
    } catch {
      return false;
    }
  }
}