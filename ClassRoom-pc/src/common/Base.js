exports.ExceptionNotDone = {code:1001, message:"Function is not implemented!"};
exports.LogLevelEx = {
    //Will show all logs
    Verbose: 0,

    //Will show logs that level >= Debug(1)
    Debug: 1,

    //Will show logs that level >= Info(10)
    Info: 10,

    //Will show logs that level >= Warn(20)
    Warn: 20,

    //Will show logs that level >= Error(30)
    Error: 30,

    //Will show logs that marks crash.
    Crash: 100
};