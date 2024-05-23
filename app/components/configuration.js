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

  
  