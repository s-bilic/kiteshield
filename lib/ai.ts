import { OpenAI } from "langchain/llms/openai";
import { ChatPromptTemplate, PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { z } from "zod";

const model = new OpenAI({
  openAIApiKey: process.env.AI_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.1,
});

const template = process.env.AI_TEMPLATE_PROMPT;

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      risk: z.string().describe("Calculated risk score"),
      reasons: z.array(z.string()).describe("1 reason"),
    })
    .describe("An object containing the risk score and reasons"),
);

const outputFixingParser = OutputFixingParser.fromLLM(model, outputParser);

// Don't forget to include formatting instructions in the prompt!
const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["day", "week", "month"],
  partialVariables: {
    format_instructions: outputFixingParser.getFormatInstructions(),
  },
});

const chain = new LLMChain({
  llm: model,
  prompt: promptTemplate,
  outputKey: "records",
  outputParser: outputFixingParser,
});

const AIResponse = async (a, b, c) => {
  const response = await chain.call({
    day: a,
    week: b,
    month: c,
  });

  return response;
};

export { AIResponse };
