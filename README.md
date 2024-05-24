# Application Setup

This guide will help you set up and run the application using nodemon in Visual Studio Code.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Visual Studio Code](https://code.visualstudio.com/)

## Steps to Run the Application

1. **Open Visual Studio Code**:
   - Launch Visual Studio Code on your computer.

2. **Open the Integrated Terminal**:
   - Click on `Terminal` in the top menu.
   - Select `New Terminal`.
   - Alternatively, you can use the shortcut `` Ctrl+` `` (Control key plus backtick).

3. **Navigate to the Application Directory**:
   - In the terminal, run the following command to navigate to the app directory:
     ```sh
     cd .\app\
     ```

4. **Run the Application with Nodemon**:
   - In the terminal, run the following command to start the application with nodemon:
     ```sh
     nodemon index.js
     ```

## Configuration

The configuration file for the application is located in the `components` directory.

- Path: `components/configuration.js`

Ensure that all necessary configurations are set in this file before running the application.

### Sample Configuration

Here is a sample configuration that is used by the `JourneyService` class to manage user journeys:

```javascript
const journeyConfig = {
    "name": "Sample Journey",
    "start": "campaign_triggered",
    "blocks": {
      "campaign_triggered": {
        "type": "action",
        "action": "send_email",
        "next": "wait_for_email_response"
      },
      "wait_for_email_response": {
        "type": "wait",
        "timeout": 86400,
        "events": {
          "email_link_clicked_yes": "add_to_crm",
          "timeout": "send_whatsapp"
        }
      },
      "send_whatsapp": {
        "type": "action",
        "action": "send_whatsapp",
        "next": "wait_for_whatsapp_response"
      },
      "wait_for_whatsapp_response": {
        "type": "wait",
        "timeout": 86400,
        "events": {
          "whatsapp_response_yes": "add_to_crm",
          "timeout": "update_failure_and_exit"
        }
      },
      "add_to_crm": {
        "type": "action",
        "action": "update_crm",
        "next": "exit"
      },
      "update_failure_and_exit": {
        "type": "action",
        "action": "update_failure_count",
        "next": "exit"
      }
    }
};

module.exports = journeyConfig;
