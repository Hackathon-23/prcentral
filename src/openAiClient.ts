import { OpenAIClient, AzureKeyCredential } from  "@azure/openai";
require('dotenv').config();

console.log(require('dotenv').config())
export const client = new OpenAIClient(
    process.env.AZURE_OPENAI_END_POINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY) //empty??
);
 