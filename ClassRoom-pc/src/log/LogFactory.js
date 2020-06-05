import logC from "./LogConsole"
import LogLocalFile from "./LogLocalFile";

class LogFactory {

    New(type, prop) {
        if (!type) {
            return new logC(prop);
        }

        if ("LocalFile".toLowerCase() === type.toLowerCase()) {
            return new LogLocalFile(prop);
        }
        if ("Console".toLowerCase() === type.toLowerCase()) {
            return new logC(prop);
        } else {
            return new logC(prop);
        }
    }
}

export default LogFactory;