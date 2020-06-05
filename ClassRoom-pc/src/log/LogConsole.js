import LogEx from "./LogEx"

class LogConsole extends LogEx {
    write(line) {
        console.log(line);
    }
}

export default LogConsole;