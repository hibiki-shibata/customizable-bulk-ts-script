import { BulkActionService } from '../service/bulkAction.service.js'

export async function requestTypeController(): Promise<void> {
    const bulkActionService = new BulkActionService()
    console.log("Starting Basic Bulk Action...🤖")
    bulkActionService.executeBulkAction()
}