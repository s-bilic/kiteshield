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

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   ["system", template],
//   // ["assistant", assistantTemplate],
// ]);

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .object({
      daily_volume: z.string().describe("Volume risk score"),
      daily_change: z.string().describe("Price change risk score"),
    })
    .describe(
      "An object containing the volume risk score and price change risk score",
    ),
);

const outputFixingParser = OutputFixingParser.fromLLM(model, outputParser);

// Don't forget to include formatting instructions in the prompt!
const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["daily_volume", "daily_change"],
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

// const response = await chain.call({
//   daily_volume: "1,000,000",
//   daily_change: "3%",
// });

const AIResponse = async (a, b) => {
  const response = await chain.call({
    daily_volume: a,
    daily_change: b,
  });

  return response;
};

export { AIResponse };
