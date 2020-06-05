import LogEx from "./LogEx"

const os = require('os');
const fs = require('fs');

class LogLocalFile extends LogEx {
    //todo: fit MAC.
    //todo: fit win7
    _dirName = os.homedir() + '\\AppData\\Roaming\\duowan\\yy\\log\\';

    //todo: log file name should be able to changed by user,
    //so an extra property is need to do this.
    _fileName = 'electron.log';

    _fullName = "";

    constructor(props) {
        super(props);

        if (props.logDirName) {
            this._dirName = props.logDirName;
        }
        if (props.logFileName) {
            this._fileName = props.logFileName;
        }

        this._fullName = this._combine(this._dirName, this._fileName);

        fs.mkdir(this._dirName, {recursive: true}, (err) => {
            if (err) throw err;
        });
    }

    _combine(dir, fileName) {
        return dir && fileName
            ? (dir
                + ((dir.endsWith('/') || dir.endsWith('\\') || fileName.startsWith('/') || fileName.startsWith('\\'))
                    ? ''
                    : '/')
                + fileName)
            : "";
    }

    get logFileNameFull() {
        return this._fullName;
    }

    //todo: use cache to enhance performance.
    write(line) {
        fs.appendFile(this._fullName, '\n' + line, function (err) {
            if (err) {
                console.log("Write log failed: " + JSON.stringify(err));
                console.log("Failed log: " + line)
            }
        });
    }
}

export default LogLocalFile;