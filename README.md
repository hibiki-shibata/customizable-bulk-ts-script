## ~ Simple overviews of expected behavior ~ 🐣
1. Prepare some resource files. (Ref: [What you prepare](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/doc/what-to-prepare.md))
   - CSV file as a source of custom values for each request in Bulk Action.
   - JSON file to define the request body.
   - Acces-token.txt to insert the security token.
3. Run this script.
4. Bulk request automatically starts.
5. You'll see a message "🎉ALL REQUEST WERE PROCESSED🎉" when requets of all line of CSV data were sent.

##

##   How to run script for Bulk Action📚:
#### Prerequisite:
1. Install Node.js (Download via [Node.js official](https://nodejs.org/en/download))
2. Install dependencies by command.
    ```bash 
    npm install
    ```
    
    Run the project by command🔥
    ```bash
    npm start --prefix <File path to bulk-script-customizable folder>
    ```

