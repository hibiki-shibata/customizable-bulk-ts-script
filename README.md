## ~ Simple overviews of expected behavior ~ 🐣
1. Prepare some resource files. (Ref: The below "What you manually prepare")
   - CSV file as a source of custom values for each request in Bulk Action.
   - JSON file to define the request body.
   - Acces-token.txt to insert the security token.
3. Run this script.
4. Bulk request automatically starts.
5. You'll see a message "🎉ALL REQUEST WERE PROCESSED🎉" when requets of all line of CSV data were sent.

##

## A) What you prepare -> only editting some files in [./Resource folder](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/) ✍️:

1. Edit [`config.ts`](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/config.ts)🔧
   - Configure basic info of each HTTP Request for Bulk Action.
      -  method, URI, CSV/JSON file names etc.
   - ※ For those who's not familar with Browser scraping🧑‍🎓.
      - [This chrome example](https://developer.chrome.com/docs/devtools/network) would be helpful to retrieve basic HTTP request info you need.

2. Edit [JSON file](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/requestBody-config.json)📝
   - Define the structure of request body's JSON data📝.
   - Use placeholder [<Your CSV column name>] for parts that should be replaced by values from CSV.
   
3. Edit [CSV file](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/custom-values.csv)📁.
   -  Store all the values used in the HTTP requests.
   -  The values will be used line by line for each HTTP request.

5. Edit [access-token.txt](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/access-token.txt)🛡️
   - Paste your access token that should be included in the HTTP requests.
   - Be careful not to commit the real token in Git.


<p align="center" border="none">
  <img alt="Bulk tool, the relation of CSV, JSON and config" src="./doc/bulkToolDesc.jpg" align="center">
</p>


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
    npm start --prefix <File path to bulk-action-for-daily-task-automation folder>
    ```
