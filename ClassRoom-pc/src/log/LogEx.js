import Base from "../common/Base"

class LogEx {
    //section of private types.
    ErrorCode = {
        LogLevelIsNotNumber: 10001
    };

    //section of this class.
    DefaultLogLevel = Base.LogLevelEx.Verbose;

    _level = this.DefaultLogLevel;
    _prefix = "";

    constructor(prop) {
        if (prop && prop.hasOwnProperty("logLevel")) {
            this.logLevel = prop.logLevel;
        }
        if (prop && prop.hasOwnProperty("logPrefix")) {
            this.prefix = prop.logPrefix;
        }
    }

    checkLogLevel(level) {
        if (undefined === level) {
            return;
        }

        if (typeof (level) !== "number") {
            throw {code: this.ErrorCode.LogLevelIsNotNumber, message: "Invalid log level!"};
        }
    }

    get logLevel() {
        return this._level;
    }

    set logLevel(level) {
        this.checkLogLevel(level);
        this._level = level;
    }

    get prefix() {
        return this._prefix;
    }

    set prefix(value) {
        this._prefix = value;
    }

    logLevelToText(logLevel) {
        switch (logLevel) {
            case Base.LogLevelEx.Verbose:
                return "Verbose";
            case Base.LogLevelEx.Debug:
                return "Debug";
            case Base.LogLevelEx.Info:
                return "Info";
            case Base.LogLevelEx.Warn:
                return "Warn";
            case Base.LogLevelEx.Error:
                return "Error";
            case Base.LogLevelEx.Crash:
                return "Crash";
            default:
                return logLevel;
        }
    }

    formatDate(date) {
        return date.getFullYear() + "-" +
            (date.getMonth() + 1) + "-" +
            date.getDay() + "-" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds() + "." +
            date.getMilliseconds();
    }

    formatNow() {
        return this.formatDate(new Date());
    }

    formatText(text, args) {
        if (!args || args.length === 0) {
            return text;
        }

        let i = 0;
        for (let arg of args) {
            text = text.replace("$" + i, typeof arg === "object" ? JSON.stringify(arg) : arg);
            i++;
        }

        return text;
    }

    //this is a very important method, which let us have the ability to change log format for each content.
    format(level, content, args) {
        let text = "[level] time content";

        text = this._prefix + text;
        text = text.replace("level", this.logLevelToText(level));
        text = text.replace("time", this.formatNow());
        text = text.replace("content", this.formatText(content, args));

        //text = this._prefix
        // + "[" + this.logLevelToText(level) + "] "
        // + this.formatNow() + " "
        // + this.formatText(content, args);
        return text;
    }

    write(line) {
        throw(Base.ExceptionNotDone);
    }

    log(level, content, args) {
        if (level < this._level) {
            return;
        }
        let line = this.format(level, content, args);
        this.write(line);
    }

    debug(content, ...args) {
        this.log(Base.LogLevelEx.Debug, content, args);
    }

    info(content, ...args) {
        this.log(Base.LogLevelEx.Info, content, args);
    }

    warn(content, ...args) {
        this.log(Base.LogLevelEx.Warn, content, args);
    }

    error(content, ...args) {
        this.log(Base.LogLevelEx.Error, content, args);
    }

    crash(content, ...args) {
        this.log(Base.LogLevelEx.Crash, content, args);
    }
}

export default LogEx;