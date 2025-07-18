# UI Flows

This document outlines the main user interface flows for the **Aynix** application, based on the technical challenge of building a web platform that allows a construction company to manage clients and project estimates.

## Core Features

- Sign Up / Sign In
- Dashboard Overview
- Estimates: Create, Read, Update
- Clients: Create, Read, Update

## Flow Diagram

```mermaid
flowchart TD
    start((START)) --> signin([Sign In])
    signin --> signup([Sign Up])
    signin --> sign[[User Authenticated]]
    signup --> signin
    signup --> sign
    sign --> dashboard([Dashboard])

    dashboard --> home([Home])
    dashboard --> clients([Clients])

    home --> add_estimate([Add Estimate])
    home --> list_estimate([List All Estimates])

    add_estimate --> add_client[/Add Client/]
    add_estimate --> set_estimate[/Set Description/]
    add_estimate --> add_materials[/Add Materials/]

    list_estimate --> edit_estimate([Edit Estimate])

    clients --> add_client_2([Add Client])
    clients --> edit_client_2([Edit Client])
```
