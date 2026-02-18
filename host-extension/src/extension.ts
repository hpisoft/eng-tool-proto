import * as vscode from 'vscode';
import { DeviceManager } from './core/deviceManager';

export function activate(context: vscode.ExtensionContext) {
  console.log('[Engineering Tool] Extension activating...');

  // Instantiate DeviceManager (VS Code independent) and open main view
  const deviceManager = new DeviceManager();
  console.log('[Engineering Tool] DeviceManager instantiated');
  
  openMainView(context, deviceManager);
  console.log('[Engineering Tool] Main view opened');

  // Register other commands
  const createProjectCommand = vscode.commands.registerCommand('engineeringTool.createProject', () => {
    vscode.window.showInformationMessage('Create New Project - Not yet implemented');
  });

  const loadProjectCommand = vscode.commands.registerCommand('engineeringTool.loadProject', () => {
    vscode.window.showInformationMessage('Load Project - Not yet implemented');
  });

  const saveProjectCommand = vscode.commands.registerCommand('engineeringTool.saveProject', () => {
    vscode.window.showInformationMessage('Save Project - Not yet implemented');
  });

  const closeProjectCommand = vscode.commands.registerCommand('engineeringTool.closeProject', () => {
    vscode.window.showInformationMessage('Close Project - Not yet implemented');
  });

  context.subscriptions.push(createProjectCommand);
  context.subscriptions.push(loadProjectCommand);
  context.subscriptions.push(saveProjectCommand);
  context.subscriptions.push(closeProjectCommand);
}

export function deactivate() {}

// Function to open the main view
async function openMainView(context: vscode.ExtensionContext, deviceManager: DeviceManager) {
  // Create and show the main WebView panel
  const panel = vscode.window.createWebviewPanel(
    'engineeringToolMainView',
    'Engineering Tool',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
    }
  );

  // Set the HTML content for the main view
  panel.webview.html = getMainViewHtml(panel.webview, context.extensionUri);

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'createProject':
          vscode.commands.executeCommand('engineeringTool.createProject');
          return;
        case 'loadProject':
          vscode.commands.executeCommand('engineeringTool.loadProject');
          return;
        case 'saveProject':
          vscode.commands.executeCommand('engineeringTool.saveProject');
          return;
        case 'closeProject':
          vscode.commands.executeCommand('engineeringTool.closeProject');
          return;
        case 'addDevice':
          // Handle adding device to project
          return;
        case 'removeDevice':
          // Handle removing device from project
          return;
      }
    },
    undefined,
    context.subscriptions
  );

  // Store the panel reference
  context.subscriptions.push(panel);

  // Discover USB devices and send the list to the webview
  try {
    console.log('[Engineering Tool] Starting USB device discovery...');
    await deviceManager.discoverDevices();
    const devices = deviceManager.getOnlineDevices();
    panel.webview.postMessage({ command: 'devices', devices });
    console.log('[Engineering Tool] Device list posted to webview');
  } catch (err) {
    console.error('[Engineering Tool] Error discovering devices:', err);
  }
}

// Function to generate the HTML for the main view
function getMainViewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'style.css'));
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Engineering Tool</title>
    <link href="${styleUri}" rel="stylesheet">
</head>
<body>
    <div class="toolbar">
        <button id="createProjectBtn">New Project</button>
        <button id="loadProjectBtn">Load Project</button>
        <button id="saveProjectBtn">Save Project</button>
        <button id="closeProjectBtn">Close Project</button>
    </div>
    <div class="main-container">
        <div class="online-devices">
            <h3>Online Devices</h3>
            <div id="deviceList">
                <!-- Device list will be populated here -->
            </div>
        </div>
        <div class="project-dashboard">
            <h3>Project Dashboard</h3>
            <div id="projectDevices">
                <!-- Project devices will be displayed here -->
            </div>
        </div>
    </div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
}