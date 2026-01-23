// This file is the entry point for the application
// Run this file to start the application
import { requestTypeController } from "./controller/requestTypeController.js"

function main(): void {
    console.log(`=========================================================================\n\n⚠️ Do not forget to update your Access Token in access-token.txt file ⚠️\n\n=========================================================================`)
    requestTypeController()
}

main()