## What you prepare
## -> only editting some files in [./Resource folder](https://github.com/hibiki-shibata/bulk-action-for-daily-task-automation/blob/main/resource/) ✍️:

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
  <img alt="Bulk tool, the relation of CSV, JSON and config" src="./bulkToolDesc.jpg" align="center">
</p>