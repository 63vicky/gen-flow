import type { NodeCatalogItem } from "./workflow-types"

export const NODE_CATALOG: NodeCatalogItem[] = [
  // Triggers
  {
    type: "trigger_webhook",
    label: "Webhook Trigger",
    description: "Start workflow when a webhook is received",
    category: "trigger",
    icon: "Webhook",
    color: "#10b981",
    fields: [
      {
        name: "path",
        label: "Webhook Path",
        type: "text",
        placeholder: "/my-webhook",
        defaultValue: "/webhook",
        required: true,
      },
      {
        name: "method",
        label: "HTTP Method",
        type: "select",
        defaultValue: "POST",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
    ],
    inputs: 0,
    outputs: 1,
  },
  {
    type: "trigger_schedule",
    label: "Schedule Trigger",
    description: "Start workflow on a schedule",
    category: "trigger",
    icon: "Clock",
    color: "#10b981",
    fields: [
      {
        name: "cron",
        label: "Cron Expression",
        type: "text",
        placeholder: "0 * * * *",
        defaultValue: "0 * * * *",
        required: true,
      },
      {
        name: "timezone",
        label: "Timezone",
        type: "text",
        placeholder: "UTC",
        defaultValue: "UTC",
      },
    ],
    inputs: 0,
    outputs: 1,
  },
  // Actions
  {
    type: "http_request",
    label: "HTTP Request",
    description: "Make an HTTP request to an external API",
    category: "action",
    icon: "Globe",
    color: "#3b82f6",
    fields: [
      {
        name: "url",
        label: "URL",
        type: "text",
        placeholder: "https://api.example.com/endpoint",
        required: true,
      },
      {
        name: "method",
        label: "Method",
        type: "select",
        defaultValue: "GET",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
          { label: "PATCH", value: "PATCH" },
        ],
      },
      {
        name: "headers",
        label: "Headers (JSON)",
        type: "textarea",
        placeholder: '{"Content-Type": "application/json"}',
        defaultValue: "{}",
      },
      {
        name: "body",
        label: "Body (JSON)",
        type: "textarea",
        placeholder: '{"key": "value"}',
      },
    ],
    inputs: 1,
    outputs: 1,
  },
  {
    type: "delay",
    label: "Delay",
    description: "Wait for a specified duration",
    category: "action",
    icon: "Timer",
    color: "#3b82f6",
    fields: [
      {
        name: "duration",
        label: "Duration (ms)",
        type: "number",
        placeholder: "1000",
        defaultValue: 1000,
        required: true,
      },
    ],
    inputs: 1,
    outputs: 1,
  },
  {
    type: "set_variable",
    label: "Set Variable",
    description: "Set a workflow variable",
    category: "action",
    icon: "Variable",
    color: "#3b82f6",
    fields: [
      {
        name: "variableName",
        label: "Variable Name",
        type: "text",
        placeholder: "myVariable",
        required: true,
      },
      {
        name: "value",
        label: "Value",
        type: "textarea",
        placeholder: "Enter value or expression",
        required: true,
      },
    ],
    inputs: 1,
    outputs: 1,
  },
  // Logic
  {
    type: "condition",
    label: "Condition",
    description: "Branch based on a condition",
    category: "logic",
    icon: "GitBranch",
    color: "#f59e0b",
    fields: [
      {
        name: "expression",
        label: "Condition Expression",
        type: "textarea",
        placeholder: "{{data.value}} > 10",
        required: true,
      },
    ],
    inputs: 1,
    outputs: 2, // true/false branches
  },
  {
    type: "loop",
    label: "Loop",
    description: "Iterate over an array",
    category: "logic",
    icon: "Repeat",
    color: "#f59e0b",
    fields: [
      {
        name: "arrayPath",
        label: "Array Path",
        type: "text",
        placeholder: "{{data.items}}",
        required: true,
      },
    ],
    inputs: 1,
    outputs: 1,
  },
  // Integrations
  {
    type: "send_email",
    label: "Send Email",
    description: "Send an email notification",
    category: "integration",
    icon: "Mail",
    color: "#8b5cf6",
    fields: [
      {
        name: "to",
        label: "To",
        type: "text",
        placeholder: "recipient@example.com",
        required: true,
      },
      {
        name: "subject",
        label: "Subject",
        type: "text",
        placeholder: "Email subject",
        required: true,
      },
      {
        name: "body",
        label: "Body",
        type: "textarea",
        placeholder: "Email content...",
        required: true,
      },
    ],
    inputs: 1,
    outputs: 1,
  },
  {
    type: "slack_message",
    label: "Slack Message",
    description: "Send a message to Slack",
    category: "integration",
    icon: "MessageSquare",
    color: "#8b5cf6",
    fields: [
      {
        name: "channel",
        label: "Channel",
        type: "text",
        placeholder: "#general",
        required: true,
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Your message here...",
        required: true,
      },
    ],
    inputs: 1,
    outputs: 1,
  },
]

export function getNodeCatalogItem(type: string): NodeCatalogItem | undefined {
  return NODE_CATALOG.find((item) => item.type === type)
}

export function getNodesByCategory(category: NodeCatalogItem["category"]): NodeCatalogItem[] {
  return NODE_CATALOG.filter((item) => item.category === category)
}
