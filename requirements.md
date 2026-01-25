# Requirements for Engineering Tool Prototype

## Overview
The Engineering Tool Prototype is a modular device engineering tool implemented as a VS Code extension. It aims to provide a user-friendly interface for managing online devices and project dashboards within the VS Code environment.

## Functional Requirements

### Main View
- The extension must provide at least one main view accessible within VS Code.
- The main view shall consist of sub-views arranged as follows:
  - Left side: Online devices view
  - Middle: Project dashboard view
  - Top: Toolbar with buttons for project management

### Online Devices View (Left Side)
- Display a list of available online devices.
- Allow users to view device details (e.g., name, status, type).
- Devices in this view remain available even when added to a project.

#### Device Data Model
Each online device must provide the following minimal data:
- **Device Type**: The type or category of the device (e.g., sensor, actuator, controller).
- **Device ID**: A unique identifier for the device.
- **Device Path**: The network path or address to access the device.

### Project Dashboard View (Middle)
- Display devices currently added to the active project.
- Provide a dashboard interface for managing project-specific device configurations.
- Allow visualization and interaction with project devices.

### Toolbar (Top)
- Provide buttons for the following actions:
  - Create new project
  - Load project from file
  - Save current project to file
  - Close current project

### User Actions
- **Create New Project**: Initialize a new empty project.
- **Add Device to Project**: Select a device from the online devices view and add it to the project dashboard. The device remains in the online devices view.
- **Remove Device from Project**: Remove a device from the project dashboard without affecting the online devices view.
- **Save Project**: Persist the current project state to a file (e.g., JSON format).
- **Close Project**: Close the current project, clearing the project dashboard.
- **Open Project**: Load a project from a file and populate the project dashboard accordingly.

## Non-Functional Requirements

### Architecture
- Core logic must be kept VS Code-independent to ensure reusability.
- Implement modular design with clear separation between VS Code extension code and core business logic.
- Core modules should be testable and framework-agnostic.

### Performance
- The extension should load quickly and not significantly impact VS Code performance.
- Device list updates should be efficient, especially for large numbers of devices.

### Usability
- Intuitive user interface following VS Code design patterns.
- Clear visual distinction between online devices and project devices.
- Responsive layout that adapts to different window sizes.

### Compatibility
- Compatible with VS Code versions supporting the required APIs.
- Support for Windows, macOS, and Linux platforms.

### Security
- No sensitive data storage without proper encryption.
- Validate file inputs when loading projects to prevent malicious content.

## Future Considerations
- Potential for device simulation modes.
- Integration with external device management systems.
- Advanced project collaboration features.