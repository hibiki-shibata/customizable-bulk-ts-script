import { BulkActionService } from '../service/bulkAction.service.js';
import { config } from '../../resource/config.js';
import { getFileContent } from '../util/fileReader.js';

export async function requestTypeController(): Promise<void> {
    const bulkActionService = new BulkActionService()
    console.log("Starting Basic Bulk Action...🤖")
    bulkActionService.executeBulkAction()
}