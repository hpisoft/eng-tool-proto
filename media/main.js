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

// Devices received from the extension
let sampleDevices = [];

const projectDevices = [];

// Handle messages from the extension
window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'devices') {
    sampleDevices = message.devices || [];
    renderOnlineDevices();
  }
});

// Function to render online devices
function renderOnlineDevices() {
  const deviceList = document.getElementById('deviceList');
  deviceList.innerHTML = '';

  sampleDevices.forEach(device => {
    const deviceItem = document.createElement('div');
    deviceItem.className = 'device-item';
    deviceItem.innerHTML = `
      <div class="device-content">
        <table class="device-table">
          <tr>
            <td class="prop-name">Device ID</td>
            <td class="prop-value">${device.id}</td>
          </tr>
          <tr>
            <td class="prop-name">Type ID</td>
            <td class="prop-value">${device.typeId}</td>
          </tr>
          <tr>
            <td class="prop-name">Type Name</td>
            <td class="prop-value">${device.typeName}</td>
          </tr>
        </table>
        <button class="add-button" onclick="addToProject('${device.id}')" title="Add to Project">
          <span>+</span>
        </button>
      </div>
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
      <strong>${device.typeName}</strong><br>
      Device ID: ${device.id}<br>
      Type ID: ${device.typeId}
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