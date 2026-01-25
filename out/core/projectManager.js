"use strict";
// core/projectManager.ts - VS Code independent project management
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
class ProjectManager {
    constructor() {
        this.currentProject = null;
    }
    createProject(name) {
        this.currentProject = { name, devices: [] };
        return this.currentProject;
    }
    getCurrentProject() {
        return this.currentProject;
    }
    addDeviceToProject(device) {
        if (!this.currentProject) {
            return false;
        }
        if (!this.currentProject.devices.find(d => d.id === device.id)) {
            this.currentProject.devices.push(device);
            return true;
        }
        return false;
    }
    removeDeviceFromProject(deviceId) {
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
    closeProject() {
        this.currentProject = null;
    }
    saveProject() {
        if (!this.currentProject) {
            return null;
        }
        return JSON.stringify(this.currentProject, null, 2);
    }
    loadProject(data) {
        try {
            const project = JSON.parse(data);
            this.currentProject = project;
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=projectManager.js.map