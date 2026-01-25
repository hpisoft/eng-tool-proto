// main.js for the Engineering Tool WebView

const vscode = acquireVsCodeApi();

// Toolbar button event listeners
document.getElementById('createProjectBtn').addEventListener('click', () => {
  vscode.postMessage({ command: 'createProject' });
});

document.getElementById('loadProjectBtn').addEventListener('click', () => {
  vscode.postMessage({ command: 'loadProject' });
});

document.getElementById('saveProjectBtn').addEventListener('click', () => {
  vscode.postMessage({ command: 'saveProject' });
});

document.getElementById('closeProjectBtn').addEventListener('click', () => {
  vscode.postMessage({ command: 'closeProject' });
});

// Sample data for demonstration
const sampleDevices = [
  { id: 'dev1', type: 'Sensor', path: '/dev/sensor1' },
  { id: 'dev2', type: 'Actuator', path: '/dev/actuator1' },
  { id: 'dev3', type: 'Controller', path: '/dev/controller1' }
];

const projectDevices = [];

// Function to render online devices
function renderOnlineDevices() {
  const deviceList = document.getElementById('deviceList');
  deviceList.innerHTML = '';

  sampleDevices.forEach(device => {
    const deviceItem = document.createElement('div');
    deviceItem.className = 'device-item';
    deviceItem.innerHTML = `
      <strong>${device.type}</strong><br>
      ID: ${device.id}<br>
      Path: ${device.path}
      <button onclick="addToProject('${device.id}')">Add to Project</button>
    `;
    deviceList.appendChild(deviceItem);
  });
}

// Function to render project devices
function renderProjectDevices() {
  const projectDevicesDiv = document.getElementById('projectDevices');
  projectDevicesDiv.innerHTML = '';

  if (projectDevices.length === 0) {
    projectDevicesDiv.innerHTML = '<p>No devices in project</p>';
    return;
  }

  projectDevices.forEach(device => {
    const deviceItem = document.createElement('div');
    deviceItem.className = 'device-item';
    deviceItem.innerHTML = `
      <strong>${device.type}</strong><br>
      ID: ${device.id}<br>
      Path: ${device.path}
      <button onclick="removeFromProject('${device.id}')">Remove</button>
    `;
    projectDevicesDiv.appendChild(deviceItem);
  });
}

// Function to add device to project
function addToProject(deviceId) {
  const device = sampleDevices.find(d => d.id === deviceId);
  if (device && !projectDevices.find(d => d.id === deviceId)) {
    projectDevices.push(device);
    renderProjectDevices();
    vscode.postMessage({ command: 'addDevice', deviceId });
  }
}

// Function to remove device from project
function removeFromProject(deviceId) {
  const index = projectDevices.findIndex(d => d.id === deviceId);
  if (index > -1) {
    projectDevices.splice(index, 1);
    renderProjectDevices();
    vscode.postMessage({ command: 'removeDevice', deviceId });
  }
}

// Initialize the view
renderOnlineDevices();
renderProjectDevices();