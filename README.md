Sample-App-Auth-Drive-JS
========================
This sample application provides an introduction to working with the Spark OAuth 2.0 process and examples of basic Spark Drive functionalities.

Required setup before running the sample code 
=============================================
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developers.
3. In the API Keys tab of the app registration, enter the fully qualified URL of the sample's callback.html file (do not use a relative path).
4. Copy the app key and app secret for later use.
5. Copy scripts/config.example.js to scripts/config.js and set your app's details there:
  *  Copy your app key to the value of the variable CLIENT_ID.
  *  Base64 encode app key and app secret as a single string separated by a colon (app key:app secret) placing the encoded result as the value of the variable AUTH_HASH. Base64 encoding can be performed at https://www.base64encode.org/. 
  *  Enter the URL of the sample's callback.html file in the REDIRECT_URL variable. This must be the same as the callback URL entered in the app definitions, with full qualified URL (e.g. https://example.com/my-project/callback.html)
  *  Save your changes and run the sample.
