import Anthropic from '@anthropic-ai/sdk';
import { REGISTERED_TOOLS, registerTool } from './tools';

export interface ChatMessage {
    type: string;
    text: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: ChatMessage[];
}

export interface Conversation {
  messages: Message[];
}

registerTool({
    name: "extract_title",
    description: "Extracts the main title or heading from a PDF document that should be shown as the title.",
    input_schema: {
        type: "object",
        properties: {
            title: {
                type: "string",
                description: "The title of the PDF"
            }
        },
        required: ["title"]
    }
})(extractTitle);
export function extractTitle(title: string): string {
    return title;
}

export const callAIwTools = async (
    conversation: Conversation,
    tools: Function[],
    client: Anthropic = new Anthropic()
) => {
    // Get tool definitions for the provided functions
    const toolDefinitions = tools.map(tool => {
        const def = REGISTERED_TOOLS[tool.name];
        if (!def) throw new Error(`Tool definition not found for ${tool.name}`);
        return {
            name: def.name,
            description: def.description,
            input_schema: def.input_schema
        };
    });

    const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        // @ts-ignore
        messages: conversation.messages,
        tools: toolDefinitions,
        tool_choice: {"type": "any"},
    });

    const tool_resp = response.content[0];
    // @ts-ignore
    const tool_name = tool_resp.name;
    // @ts-ignore
    const tool_inputs = tool_resp.input;
    return {"name": tool_name, "inputs": tool_inputs};
}; 