# Architecture for Engineering Tool Prototype

## Overview

The Engineering Tool Prototype follows a modular architecture designed to separate
VS Code-specific code from core business logic. This ensures that the core
functionality can be reused in other environments or frameworks.

## High-Level Architecture

```text
┌─────────────────┐
│   VS Code       │
│   Extension     │
│                 │
│ ┌─────────────┐ │
│ │  Extension  │ │
│ │   Wrapper   │ │
│ └─────────────┘ │
└─────────────────┘
          │
          ▼
┌─────────────────────────────┐
│   Core Logic                │
│   (VS Code Independent)     │
│                             │
│ ┌─────────────┐             │
│ │ Device Mgmt │             │
│ └─────────────┘             │
│                             │
│ ┌─────────────┐             │
│ │ Project     │             │
│ │ Management  │             │
│ └─────────────┘             │
│                             │
│ ┌─────────────┐             │
│ │ Data        │             │
│ │ Persistence │             │
│ └─────────────┘             │
│                             │
│ ┌──────────────────────┐    │
│ │  Driver Manager      │    │
│ │  (Process Pool)      │    │
│ └──────────────────────┘    │
└─────────────────────────────┘
          │
          ├──────────────────────┐
          │                      │
          ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│  Driver Process  │    │  Driver Process  │
│ ┌──────────────┐ │    │ ┌──────────────┐ │
│ │ Device Type  │ │    │ │ Device Type  │ │
│ │  Driver      │ │    │ │  Driver      │ │
│ └──────────────┘ │    │ └──────────────┘ │
│  (Isolated)      │    │  (Isolated)      │
└──────────────────┘    └──────────────────┘
         ...                    ...
```

## Components

### VS Code Extension Layer

- **Purpose**: Provides the VS Code integration, UI components, and extension
  lifecycle management.
- **Technologies**: TypeScript, VS Code Extension API.
- **Responsibilities**:
  - Register extension commands and views.
  - Handle VS Code-specific UI rendering (WebViews, TreeViews).
  - Manage extension activation and deactivation.
  - Bridge between VS Code APIs and core logic.

### Core Logic Layer

- **Purpose**: Contains all business logic independent of VS Code.
- **Technologies**: JavaScript/TypeScript (framework-agnostic).
- **Responsibilities**:
  - Device discovery and management.
  - Project state management.
  - Data serialization/deserialization.
  - Business rule enforcement.
  - Device type driver lifecycle management via the driver manager.

#### Core Modules

##### Device Management Module

- Handles online device discovery, status monitoring, and device information.
- Provides interfaces for device listing and details retrieval.
- Maintains device state independently of project assignments.

##### Project Management Module

- Manages project lifecycle (create, load, save, close).
- Handles device assignment to/from projects.
- Maintains project state and configuration.

##### Data Persistence Module

- Handles serialization of project data to files (e.g., JSON).
- Manages file I/O operations.
- Provides validation for loaded data.

##### Driver Manager Module

- Manages the lifecycle of all device type driver processes.
- Each driver process manages multiple device instances from its supported device types.
- Discovers, loads, and initializes device type drivers.
- Establishes and maintains inter-process communication (IPC) with drivers.
- Routes requests from other core modules to appropriate drivers for device instance
  management and operations.
- Aggregates device type information and discovered device instances from all
  loaded drivers.
- Handles driver health monitoring, crashes, and recovery with device instance state
  preservation.
- Provides a unified interface to interact with drivers and their managed device
  instances regardless of driver implementation language.

## Device Type Driver Architecture

### Overview

Device type drivers extend the engineering tool with support for specific device types.
Each driver operates in a separate process, isolated from the VS Code environment, and
manages multiple device instances from its supported device types. Drivers enable
communication between device instances and with the application host through standardized
protocols. Drivers can be implemented in any programming language (Node.js, .NET, Java,
Python, C/C++, Go, Rust, etc.) as long as they implement the standardized driver interface
and communicate via the IPC protocol using JSON-based messages.

### Driver Architecture

#### Driver Manager

- **Purpose**: Part of the core logic layer, manages the lifecycle and communication
  with all device type driver processes. Each driver manages multiple device instances
  of its supported types.
- **Isolation**: Resides in the core logic layer (VS Code independent) and communicates
  with externally spawned driver processes.
- **Multi-Language Support**: Supports drivers implemented in any language via
  standardized IPC protocols.
- **Responsibilities**:
  - Discover and load driver manifests from predefined locations.
  - Spawn and manage driver processes regardless of implementation language.
  - Establish inter-process communication (IPC) channels with drivers.
  - Route requests from other core modules to appropriate drivers for managing
    device instances using standardized message formats.
  - Aggregate device type information and discovered device instances from all
    loaded drivers.
  - Coordinate device instance management across drivers.
  - Handle driver crashes and recovery with restart logic, including restoration
    of previously managed device instances.
  - Maintain compatibility checking between drivers and the extension version.

#### Driver Process

- **Purpose**: Runs a device type driver in an isolated process and manages multiple
  device instances from its supported device types.
- **Device Instance Management**: Each driver process can manage and control multiple
  device instances of the device types it supports. Multiple devices of the same type
  or different types (if supported by the driver) are all handled by the same driver process.
- **Isolation**: Each driver runs in its own separate process, completely isolated from VS Code.
- **Responsibilities**:
  - Expose device type information (name, schema, capabilities) for supported types.
  - Discover and report all device instances of its supported types.
  - Manage lifecycle of multiple device instances (creation, configuration, deletion).
  - Validate device configurations for managed instances.
  - Provide device-specific operations and metadata for each managed instance.
  - Handle communication with device instances concurrently.
  - Enable inter-device communication between managed device instances (within the 
    driver process or across drivers through the driver manager).
  - Facilitate communication between device instances and the application host (engineering tool)
    through the driver manager via standardized protocols.

### Driver Interface

Each device type driver must implement the following interface to manage multiple
device instances with inter-device and host communication capabilities:

- **Device Type Metadata**: Provide information about the supported device type(s),
  including name, version, schema, and capabilities.
- **Device Discovery**: Implement mechanisms to discover all available device instances
  of the supported type(s) on the network or system.
- **Device Instance Management**: Support creating, configuring, and managing multiple
  device instances within the same driver process.
- **Configuration Validation**: Validate device configurations against the driver's schema
  for each device instance.
- **Device Operations**: Provide device-specific operations and interactions for managed
  device instances.
- **Concurrent Handling**: Support handling requests for multiple device instances
  concurrently and efficiently within the driver process.
- **Inter-Device Communication**: Enable device instances to communicate with each other,
  either directly within the driver process or through asynchronous messaging.
- **Host Communication**: Provide mechanisms for device instances to send data and events
  to the application host (engineering tool core logic) through the driver manager.
- **Message Routing**: Support routing of messages between device instances and the host,
  enabling bidirectional communication and event propagation.

### Communication Protocol

#### Driver Manager ↔ Driver Communication

- **IPC Mechanism**: Use inter-process communication (IPC) such as:
  - Node.js Worker Threads API for same-machine processes.
  - Child processes with stdio or socket-based messaging.
  - Named pipes or Unix sockets for cross-process communication.
  - HTTP/REST APIs for network-based drivers.
  - gRPC or other RPC protocols for efficient cross-language communication.
- **Message Format**: Standardized JSON-based message format for requests and responses.
  This ensures language-agnostic communication between the driver manager and drivers
  implemented in any programming language.
- **Encoding**: UTF-8 encoding for text-based protocols to ensure compatibility
  across different technologies.
- **Error Handling**: Drivers should report errors in a standardized format to the
  driver manager.

#### Inter-Device Communication (Within Driver Process)

- **Direct Communication**: Device instances within the same driver process can
  communicate directly through in-process messaging or shared memory.
- **Event System**: Drivers implement an event system allowing device instances to
  listen and subscribe to events from other device instances.
- **Message Routing**: Messages between device instances are routed by the driver,
  ensuring reliable delivery and order preservation.

#### Device Instance ↔ Application Host Communication

- **Bidirectional Channel**: Device instances communicate with the application host
  through the driver manager via the standardized IPC mechanism.
- **Host-Initiated Commands**: The application host can send commands to device
  instances through the driver manager, which routes them to the appropriate driver
  and device instance.
- **Device Events**: Device instances can emit events and data to the application host
  through the driver manager, enabling real-time updates and notifications.
- **Data Serialization**: All data exchanged uses standardized JSON-based serialization
  for cross-platform and cross-language compatibility.

### Driver Loading and Registration

1. **Discovery**: Scan predefined driver locations (e.g., local plugins directory,
   installed npm packages) for drivers.
2. **Validation**: Verify driver manifests to ensure they provide required metadata.
3. **Instantiation**: Spawn driver processes with the driver initialization parameters.
4. **Registration**: Register drivers with the device manager for device discovery.
5. **Monitoring**: Continuously monitor driver health; restart on failure.

### Benefits of Process Isolation

- **Stability**: A crashing driver does not crash the VS Code extension.
- **Security**: Drivers run with restricted capabilities, reducing security risks.
- **Resource Management**: Drivers can be unloaded or paused without affecting the core.
- **Version Compatibility**: Different drivers can use different dependency versions.
- **Scalability**: Multiple driver instances can run concurrently.

## Data Persistence Module

- Handles serialization of project data to files (e.g., JSON).
- Manages file I/O operations.
- Provides validation for loaded data.

## Data Flow

1. **Extension Activation**: VS Code loads the extension, which initializes the
   core logic (including the driver manager).
2. **Driver Initialization**: The driver manager spawns configured device type driver
   processes in isolation.
3. **Driver Registration**: Drivers report their supported device types to the
   device manager through the IPC channel.
4. **Device Instance Discovery**: The driver manager queries drivers to discover all
   available device instances they manage of each supported type.
5. **UI Rendering**: Extension creates WebViews and TreeViews, populating them with
   data from core modules including device instances discovered from drivers.
6. **User Interactions**: User actions (e.g., button clicks) are handled by the
   extension layer and delegated to core logic.
7. **Driver Operations**: Core logic requests driver-specific operations through
   the driver manager via IPC to manipulate device instances.
8. **Inter-Device Communication**: Device instances within the same driver communicate
   directly (in-process messaging) or asynchronously through the driver's event system.
9. **Device-to-Host Communication**: Device instances emit events and data to the
   application host through the driver manager via standardized IPC, enabling real-time
   updates and bidirectional interaction.
10. **Data Updates**: Core logic and extension layer are updated with data and events
    from device instances, triggering UI refreshes and state updates.
11. **Persistence**: Project save/load operations flow through the data persistence
    module, including device instance configurations and states.

## Design Principles

### Separation of Concerns

- Strict separation between VS Code-specific code and core logic.
- Core modules should not import VS Code APIs.
- Device type drivers are completely isolated from the VS Code environment.

### Modularity

- Each core module has a well-defined interface.
- Modules can be tested independently.

### Testability

- Core logic designed for easy unit testing without VS Code dependencies.
- Mock interfaces for external dependencies.

### Extensibility

- Device type drivers provide a plugin architecture for adding support for new
  device types without modifying core code.
- Drivers operate independently in isolated processes, ensuring extensibility
  without stability concerns.
- Clear driver interface and IPC protocol for integration with the core system.

## Technology Choices

- **Language**: TypeScript for type safety in both extension and core layers.
- **Build System**: Use VS Code's extension build tools (e.g., vsce, webpack).
- **Testing**: Jest for unit tests, with separate test suites for extension and
  core logic.
- **Data Format**: JSON for project files to ensure portability.
- **IPC**: Multi-language support via standardized IPC protocols:
  - JSON-based message format for language-agnostic communication.
  - Support for process-based IPC (pipes, sockets, HTTP).
  - gRPC or similar RPC frameworks for efficient cross-language calls (optional).
- **Driver Languages**: Drivers can be implemented in any language that supports
  the IPC protocol (Node.js, .NET, Java, Python, C/C++, Go, Rust, etc.).

## Device Type Driver Implementation

### Supported Technologies

Device type drivers can be implemented in various programming languages and technologies,
including but not limited to:

- **Node.js/TypeScript**: Native integration with the extension environment.
- **.NET/C#**: Enterprise-class device drivers with rich .NET ecosystem.
- **Java**: Cross-platform drivers leveraging the Java Virtual Machine.
- **Python**: Quick prototyping and integration with existing Python device libraries.
- **C/C++**: High-performance drivers for resource-constrained or real-time scenarios.
- **Go**: Lightweight, compiled drivers with excellent concurrency support.
- **Rust**: Safe, high-performance drivers with strong memory safety guarantees.

Any technology can be used as long as the driver can:
- Execute as an independent process.
- Communicate via the standardized IPC protocol (JSON-based messages).
- Implement the required driver interface.

### Driver Development Structure (Node.js/TypeScript Example)

```
driver/
├── package.json              # Driver manifest with metadata
├── src/
│   ├── driver.ts            # Main driver implementation
│   ├── deviceDiscovery.ts   # Device discovery logic
│   └── index.ts             # Driver entry point
├── dist/                     # Compiled driver code
└── tsconfig.json            # TypeScript configuration
```

### Driver Development Structure (.NET/C# Example)

```
driver/
├── EngineringToolDriver.csproj      # Project file
├── EngineringToolDriver.json        # Driver manifest with metadata
├── src/
│   ├── Driver.cs                    # Main driver implementation
│   ├── DeviceDiscovery.cs           # Device discovery logic
│   └── Program.cs                   # Driver entry point and IPC handler
└── bin/Release/                     # Compiled driver executables
```

### Driver Manifest

The driver manifest provides metadata required by the driver manager to load and identify
the driver. The format varies by technology:

#### Node.js/TypeScript Manifest (package.json)

```json
{
  "name": "@engineering-tool/driver-devicetype",
  "version": "1.0.0",
  "main": "dist/index.js",
  "engineeringTool": {
    "driverType": "device",
    "supportedDeviceTypes": ["deviceType1", "deviceType2"],
    "version": "1.0.0",
    "capabilities": ["discovery", "validation", "operations"]
  }
}
```

#### .NET/C# Manifest (EngineringToolDriver.json)

```json
{
  "driverName": "EngineringToolDriver",
  "driverVersion": "1.0.0",
  "executable": "EngineringToolDriver.exe",
  "targetFramework": "net6.0",
  "engineeringTool": {
    "driverType": "device",
    "supportedDeviceTypes": ["deviceType1", "deviceType2"],
    "version": "1.0.0",
    "capabilities": ["discovery", "validation", "operations"]
  }
}
```

#### Generic Requirements

Each driver manifest must include:

- **Driver Identification**: Unique name, version, and executable/entry point.
- **Supported Device Types**: List of device types this driver implements.
- **Capabilities**: Set of features supported (discovery, validation, operations, etc.).
- **Version Compatibility**: Driver interface version for compatibility checks.

### Driver Lifecycle

1. **Load**: Driver process is spawned and initialized.
2. **Handshake**: Driver communicates metadata to the driver manager.
3. **Ready**: Driver is ready to accept requests from the core logic.
4. **Operate**: Driver handles device discovery and operation requests.
5. **Unload**: Driver is gracefully shut down when no longer needed.

## Deployment

- Package as VS Code extension (.vsix file).
- Distribute via VS Code Marketplace or direct installation.
- Core logic could be packaged as an npm module for reuse in other projects.
