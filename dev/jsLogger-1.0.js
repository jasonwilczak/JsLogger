(function () {
    //Object to handle all the Javascript logging functions
    var jsLogger = (function () {
        //controller/action to handle the logging on the code side
        var _defaultURL = '../App/Utility/JavaScriptLog';
        //This is your default controller action for MVC 4 ajax call in case init fails
        var _url;
        //default number of logs before we attempt a write
        var _defaultMaxLogs = 10;
        var _maxLogs;

        function initialize(options) {
            if (options) {
                _url = options.LoggingUrl || _defaultURL;
                _defaultMaxLogs = options.MaxLogsBeforeDump || _defaultMaxLogs;
                dumpLogs = options.DumpLogsOverride || dumpLogs;
            }
            //This is used so that on init in view you can use the URL helper to create a url based on the controller and action
        }

        //function that actually writes the logs to the controller action
        //type: "INFO","DEBUG","ERROR"
        //system: whatever the parent class/page is that is calling this
        //operation: whatever function/method is calling this
        //jsLoggerData: JSLoggerData object
        //forceLog: True if you want to write the log immediately, 
        //-false if it will use the default cache number
        //-this will also force the ajax to be synchronous if it is True, and async if False
        //-so that we push the logs before anything else happens
        function log(type, system, operation, jsLoggerData, forceLog) {

            jsLogStorage.AddLog(
            {
                System: system,
                Operation: operation,
                LogType: type,
                Timestamp: getFormattedTimestamp(),
                Message: jsLoggerData.message
            });

            //if caller wants to force a log dump, we will set the 'maxLogs' variable to the current length
            //This is so there is no specific behaviour, we just change the max log number to be the current log number
            //so that the standard functionality will happen
            if (forceLog) {
                var _count = jsLogStorage.GetCount();
                if (_count > 0)
                { _maxLogs = _count; }
                else
                { _maxLogs = 1; }
            }
            else {
                //otherwise, just set it to the default
                _maxLogs = _defaultMaxLogs;
            }

            //If we have reached our specified capacity then write it out
            //Take note of the async part, if we are 'forcing' a log output then we want it to be synchronous to ensure it gets there
            //before anything else happens
            if (jsLogStorage.IsFull(_maxLogs)) {
                var logData = JSON.stringify(jsLogStorage.GetLogs(_maxLogs));
                dumpLogs(logData);
            }
        }
        var dumpLogs = function (logData) {            
            var request = new XMLHttpRequest();
            request.open("POST", _url, !forceLog);
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            request.setRequestHeader("Content-length", logData.length);
            request.send(logData);
            
        }
        //Returns the current timestamp in a specified format
        function getFormattedTimestamp() {
            var _date = new Date();
            var _formattedDate = (_date.getMonth() + 1) + "-" +
            _date.getDate() + "-" + _date.getYear() + " " +
            _date.getHours() + ":" + _date.getMinutes() + ":" +
            _date.getSeconds() + ":" + _date.getMilliseconds();
            return _formattedDate;
        }

        var jsLogStorage = (function () {
            var _storageBin;
            //Check if the storage is empty, null or undefined and return true/false
            function isEmpty() {
                if (_storageBin === null || _storageBin === undefined || _storageBin.length === 0) {
                    return true;
                }

                return false;
            }
            //Push a log object into the storage
            function addLog(log) {
                if (isEmpty()) {
                    _storageBin = [];
                }
                log.LogIndex = getCount(); //Sets the index of our log that we are pushing in
                _storageBin.push(log);
            }

            //Get a splice from the array from 0->n, where n = maxItemsToGet
            function getLogs(maxItemsToGet) {
                if (isEmpty()) {
                    _storageBin = [];
                }

                if (maxItemsToGet > _storageBin.length)
                { maxItemsToGet = _storageBin.length; }

                return _storageBin.splice(0, maxItemsToGet);
            }

            //Check to see if the storage is at specified capacity
            function isFull(maxItems) {
                if (isEmpty()) {
                    _storageBin = []; //Just to ensure that it is something we can get the length of
                }

                if (_storageBin.length >= maxItems) {
                    return true;
                }

                return false;
            }

            //Drop all the elements from storage up to the max number of items
            function emptyStorage(maxItemsToRemove) {
                if (isEmpty()) {
                    _storageBin = []; //Just to ensure that it is something we can get the length of
                }

                if (_storageBin.length <= maxItemsToRemove) {
                    _storageBin.splice(0, maxItemsToRemove);
                }
                else {
                    _storageBin = [];
                }
            }

            //Get the count of all the log records in storage
            function getCount() {
                if (isEmpty()) {
                    _storageBin = []; //Just to ensure that it is something we can get the length of
                }
                return _storageBin.length;
            }
            return {
                IsEmpty: isEmpty,
                AddLog: addLog,
                GetLogs: getLogs,
                IsFull: isFull,
                EmptyStorage: emptyStorage,
                GetCount: getCount
            };
        })();

        var jsLoggerData = (function () {
            var _message;

            function parseError(error) {
                if (error === null || error === undefined)
                { return "There was an unknown error trying to perform an operation."; }
                else {
                    if (error.message === null) {
                        return error;
                    }
                    else {
                        return "[Number(" + error.number +
                        ")-Name(" + error.name +
                        ")-Message(" + error.message +
                        ")-Description(" + error.description + ")]";
                    }
                }
            }
            function getMessage() { return _message; }
            function getData(message) {
                _message = message;
                return { "message": getMessage() };
            }
            function getDataFromError(error) {
                return getData(parseError(error));
            }

            return {
                GetData: getData,
                GetDataFromError: getDataFromError
            };
        })();

        return {
            MakeLog: log,
            Init: initialize,
            JSLog: jsLoggerData
        };
    })();

    this.JSLogger = jsLogger;
})();