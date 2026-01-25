# Copilot Instructions for Engineering Tool Prototype

This document provides guidelines and context for GitHub Copilot to assist in the development of the Engineering Tool Prototype.

## Project Overview

The Engineering Tool Prototype is a modular device engineering tool implemented as a VS Code extension. It provides a main view with sub-views for managing online devices and project dashboards. Key features include creating/loading/saving projects, adding/removing devices from projects, and maintaining core logic that is VS Code-independent.

## Development Guidelines

- **Language**: TypeScript (for VS Code extension), with core logic in JavaScript/TypeScript designed to be framework-agnostic.
- **Architecture**: Modular design with VS Code extension wrapper around core logic. Core modules should be testable and reusable outside VS Code.
- **Testing**: Include unit tests for all new features.
- **Documentation**: Maintain clear code comments, update this document as needed, and create separate requirements and architecture documentation.
- **Markdown Linting**: If changes in md files will be made the rules from md lintrc must be followed and the issues fixed.

## Copilot Usage

- Provide detailed prompts when requesting code generation.
- Always review and validate generated code for correctness and security.
- Use Copilot for repetitive tasks, but ensure code aligns with project standards.

## Initial Setup

This is the initial version of the instructions document. Update as the project evolves.