import { OpenAIClient, AzureKeyCredential } from  "@azure/openai";
import  { resolve } from 'path';

require('dotenv').config( { path:  resolve(__dirname,"../../env/.env.local") });

export const client = () => {
  if (process.env.AZURE_OPENAI_END_POINT && process.env.AZURE_OPENAI_API_KEY) {
    return new OpenAIClient(
      process.env.AZURE_OPENAI_END_POINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
    );
  } else {
    console.log("AZURE_OPENAI_END_POINT or process.env.AZURE_OPENAI_API_KEY is not set");
    return null;
  }
}
 