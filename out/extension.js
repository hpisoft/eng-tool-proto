"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('Engineering Tool Prototype is now active!');
    // Register the main view command
    const openMainViewCommand = vscode.commands.registerCommand('engineeringTool.openMainView', () => {
        // Create and show the main WebView panel
        const panel = vscode.window.createWebviewPanel('engineeringToolMainView', 'Engineering Tool', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
        });
        // Set the HTML content for the main view
        panel.webview.html = getMainViewHtml(panel.webview, context.extensionUri);
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
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
        }, undefined, context.subscriptions);
        // Store the panel reference
        context.subscriptions.push(panel);
    });
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
    context.subscriptions.push(openMainViewCommand);
    context.subscriptions.push(createProjectCommand);
    context.subscriptions.push(loadProjectCommand);
    context.subscriptions.push(saveProjectCommand);
    context.subscriptions.push(closeProjectCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
// Function to generate the HTML for the main view
function getMainViewHtml(webview, extensionUri) {
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
//# sourceMappingURL=extension.js.map