import * as azdev from "azure-devops-node-api";

//not used for now, we are using an inmemory store

// your collection url
const orgUrl = "https://dev.azure.com/PRCentralOrg";

const token: string = process.env.AZURE_PERSONAL_ACCESS_TOKEN;

const authHandler = azdev.getPersonalAccessTokenHandler(token);
const connection = new azdev.WebApi(orgUrl, authHandler)
export const ado = connection.getGitApi();
