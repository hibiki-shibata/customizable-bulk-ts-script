import { AuthorizationHeaderAndBodyJsonService } from '../service/authorizationHeaderAndBodyJsonService.js';
import { AuthorizationHeaderAndNobodyService } from '../service/authorizationHeaderAndNoBodyService.js';
import { GetVenueIdFromNameService } from '../service/getVenueIdFromName.js';
import { config } from '../../resource/config.js';
import { fileReader } from '../util/fileReader.js';

export async function requestTypeController(): Promise<void> {
    const accessTokenFromFile = fileReader('./resource/access-token.txt');

    if (config.getVenueIDFromName) {
        console.log("Starting to get Venue ID from Venue Name...🤖")
        GetVenueIdFromNameService.setAccessToken(accessTokenFromFile).executeBulkAction()
    } else if (!config.use_request_body) {
        console.log("Starting with NO Request body...🤖")
        AuthorizationHeaderAndNobodyService.setAccessToken(accessTokenFromFile).executeBulkAction()
    } else if (config.use_request_body) {
        // Otherwise,  call the service for authorization header and body JSON
        console.log("Starting with Request body...🤖")
        AuthorizationHeaderAndBodyJsonService.setAccessToken(accessTokenFromFile).executeBulkAction()
    } else {
        throw new Error("❌Please define if you want to use request body or not, or getVenueIDFromName in the config.ts file.")
    }

}