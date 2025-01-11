interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
  };
}

export const REGISTERED_TOOLS: Record<string, ToolDefinition> = {};

export function getRegisteredTools(): Record<string, ToolDefinition> {
    return REGISTERED_TOOLS;
}

export function registerTool(toolDef: ToolDefinition) {
    return function (target: Function) {
        REGISTERED_TOOLS[target.name] = toolDef;
        return target;
    };
}