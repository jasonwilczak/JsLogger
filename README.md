# JsLogger
A simple JavaScript logger that utilizes storage and can send the logs to a server to integrate with your application logs


###Basic Usage

    var myJsLoggerOptions = { 
      LoggingUrl: '/App/Utility/JavaScriptLog', 
      MaxLogsBeforeDump: 2, 
      DumpLogsOverride: dumpLogOverride 
    };
    JSLogger.Init(myJsLoggerOptions);
    JSLogger.MakeLog("INFO", "App.js", "Initialization", JSLogger.JSLog.GetData("App Initialized."), false);
    
###Logger Options

|       Option          |   Type    | Required  | Description  |
| --------------------- |:---------:|:---------:| ------------ |
| LoggingUrl            |    url    | true      | Web server url to pass logs to when the max bucket size is reached or if the browser is shut down |
| MaxLogsBeforeDump     |  number   | true      | Total logs that the library will hold onto until it attemps to send them to the parameter set in LoggingUrl |
| DumpLogsOverride      | function  | false     | User defined function to override the default log behavior.  For example, if you want to write to the console or do a div |


###Logging on browser exit
 
 If you want to log out what is left if the user closes the browser, you can hook into the window.onunload function:
    
        window.onunload = function (event) {
            JSLogger.MakeLog("INFO", "Application", "Browser Unload",
            JSLogger.JSLog.GetData("Browser has been unloaded."), true);
        };

###API

####JSLogger.MakeLog(type,system,operation,jsLoggerData,forceLog)
#####function that actually writes the logs

* type: "INFO","DEBUG","ERROR"
* system: whatever the parent class/page is that is calling this
* operation: whatever function/method is calling this
* jsLoggerData: JSLoggerData object (see below)
* forceLog: True if you want to write the log immediately, false if it will use the default cache number

####JSLogger.JSLog.GetData(message)

* message: any error message in string format
* returns {"message": message }

####JSLogger.JSLog.GetDataFromError(error)

* error: client side Javascript error object: {number,name,message,description} converted to a string
* returns {"message": errorAsString}

