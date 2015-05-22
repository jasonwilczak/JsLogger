﻿(function(){var jsLogger=(function(){var _defaultURL='../App/Utility/JavaScriptLog';var _url;var _defaultMaxLogs=10;var _maxLogs;function initialize(options){if(options){_url=options.LoggingUrl||_defaultURL;_defaultMaxLogs=options.MaxLogsBeforeDump||_defaultMaxLogs;dumpLogs=options.DumpLogsOverride||dumpLogs}}function log(type,system,operation,jsLoggerData,forceLog){jsLogStorage.AddLog({System:system,Operation:operation,LogType:type,Timestamp:getFormattedTimestamp(),Message:jsLoggerData.message});if(forceLog){var _count=jsLogStorage.GetCount();if(_count>0){_maxLogs=_count}else{_maxLogs=1}}else{_maxLogs=_defaultMaxLogs}if(jsLogStorage.IsFull(_maxLogs)){var logData=JSON.stringify(jsLogStorage.GetLogs(_maxLogs));dumpLogs(logData)}}var dumpLogs=function(logData){var request=new XMLHttpRequest();request.open("POST",_url,!forceLog);request.setRequestHeader('Content-type','application/json; charset=utf-8');request.setRequestHeader("Content-length",logData.length);request.send(logData)}function getFormattedTimestamp(){var _date=new Date();var _formattedDate=(_date.getMonth()+1)+"-"+_date.getDate()+"-"+_date.getYear()+" "+_date.getHours()+":"+_date.getMinutes()+":"+_date.getSeconds()+":"+_date.getMilliseconds();return _formattedDate}var jsLogStorage=(function(){var _storageBin;function isEmpty(){if(_storageBin===null||_storageBin===undefined||_storageBin.length===0){return true}return false}function addLog(log){if(isEmpty()){_storageBin=[]}log.LogIndex=getCount();_storageBin.push(log)}function getLogs(maxItemsToGet){if(isEmpty()){_storageBin=[]}if(maxItemsToGet>_storageBin.length){maxItemsToGet=_storageBin.length}return _storageBin.splice(0,maxItemsToGet)}function isFull(maxItems){if(isEmpty()){_storageBin=[]}if(_storageBin.length>=maxItems){return true}return false}function emptyStorage(maxItemsToRemove){if(isEmpty()){_storageBin=[]}if(_storageBin.length<=maxItemsToRemove){_storageBin.splice(0,maxItemsToRemove)}else{_storageBin=[]}}function getCount(){if(isEmpty()){_storageBin=[]}return _storageBin.length}return{IsEmpty:isEmpty,AddLog:addLog,GetLogs:getLogs,IsFull:isFull,EmptyStorage:emptyStorage,GetCount:getCount}})();var jsLoggerData=(function(){var _message;function parseError(error){if(error===null||error===undefined){return"There was an unknown error trying to perform an operation."}else{if(error.message===null){return error}else{return"[Number("+error.number+")-Name("+error.name+")-Message("+error.message+")-Description("+error.description+")]"}}}function getMessage(){return _message}function getData(message){_message=message;return{"message":getMessage()}}function getDataFromError(error){return getData(parseError(error))}return{GetData:getData,GetDataFromError:getDataFromError}})();return{MakeLog:log,Init:initialize,JSLog:jsLoggerData}})();this.JSLogger=jsLogger})();