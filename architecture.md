# Architecture for Engineering Tool Prototype

## Overview
The Engineering Tool Prototype follows a modular architecture designed to separate VS Code-specific code from core business logic. This ensures that the core functionality can be reused in other environments or frameworks.

## High-Level Architecture

```
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
┌─────────────────┐
│   Core Logic    │
│   (VS Code      │
│    Independent) │
│                 │
│ ┌─────────────┐ │
│ │ Device Mgmt │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ Project     │ │
│ │ Management  │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ Data        │ │
│ │ Persistence │ │
│ └─────────────┘ │
└─────────────────┘
```

## Components

### VS Code Extension Layer
- **Purpose**: Provides the VS Code integration, UI components, and extension lifecycle management.
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

## Data Flow

1. **Extension Activation**: VS Code loads the extension, which initializes the core logic.
2. **UI Rendering**: Extension creates WebViews and TreeViews, populating them with data from core modules.
3. **User Interactions**: User actions (e.g., button clicks) are handled by the extension layer and delegated to core logic.
4. **Data Updates**: Core logic updates state and notifies the extension layer for UI refreshes.
5. **Persistence**: Project save/load operations flow through the data persistence module.

## Design Principles

### Separation of Concerns
- Strict separation between VS Code-specific code and core logic.
- Core modules should not import VS Code APIs.

### Modularity
- Each core module has a well-defined interface.
- Modules can be tested independently.

### Testability
- Core logic designed for easy unit testing without VS Code dependencies.
- Mock interfaces for external dependencies.

### Extensibility
- Plugin architecture for additional device types or project features.
- Clear extension points in the core logic.

## Technology Choices

- **Language**: TypeScript for type safety in both extension and core layers.
- **Build System**: Use VS Code's extension build tools (e.g., vsce, webpack).
- **Testing**: Jest for unit tests, with separate test suites for extension and core logic.
- **Data Format**: JSON for project files to ensure portability.

## Deployment
- Package as VS Code extension (.vsix file).
- Distribute via VS Code Marketplace or direct installation.
- Core logic could be packaged as an npm module for reuse in other projects.