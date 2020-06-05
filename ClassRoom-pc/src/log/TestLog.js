import LogFactory from './LogFactory'

class TestLog {
    run() {
        /*使用工厂创建对象
        * 第一个参数是字符串，是日志功能类型。可使用的类型有：
        * console
        * 等
        *
        * 第二个参数是对象类型，是日志类的初始设置，可以不传该参数代表使用默认值。
        * 对象可用属性有：
        * level 数字类型，日志可输出的最低级别，低于该级别的日志将不予输出，默认值：LogLevel.Info（数字值是10）。取值参见：LogEx.LogLevel
        * prefix 字符串类型，日志行的前缀，每一行日志都以该前缀开头。默认值是空，代表没有前缀。
        *
        * */

        let log = new LogFactory().New("console", {prefix: "Test: "});

        /* 日志前缀：
        * 日志类提供了一个前缀功能，该功能将用于同时在不同的模块使用日志类的实例，并输出不同的内容。
        * 如果创建的时候没有设置前缀，那么可以通过该方法设置日志前缀。
        * */
        log.prefix = "##Test: ";

        /*
        * 可以通过以下方法获取当前的日志前缀。
        * */

        let currentPrefix = log.prefix;

        /*
        * 日志等级
        * 日志模块支持过滤功能，可以通过设置日志等级过滤掉等级过低的日志，以便减少日志量。
        * 只输出Error及更高级日志的方法如下：
        * */
        log.logLevel = log.LogLevel.Error;

        /*
        * 可以通过以下方法获取当前日志等级。
        * */
        let currentLevel = log.logLevel;

        /*
        * 如果想看全部日志，可以将日志等级设置为Verbose或者0.
        * */
        log.logLevel = log.LogLevel.Verbose;


        /*
        * log模块支持以下方法以记录不同级别的日志。
        * 不同的情况要通过相应的函数来记录，比如：
        * 记录详细的内部变量，内部逻辑，需要使用debug()方法。
        * 记录程序关键输出信息，可以调用info()方法。
        * 记录各种警告，需要使用warn()方法。
        * 记录异常、错误需要使用error()方法。
        * 记录崩溃需要使用crash()方法。
        * */
        log.debug("This is a Debug log.");
        log.info("This is an Info log.");
        log.warn("This is a Warn log.");
        log.error("This is an Error log.");
        log.crash("This is a Crash log");

        /*
        * 自定义格式
        * 每一个日志方法，都是支持自定义格式的。日志中，可以随意传参数，可以随意摆放参数位置。
        * 通过关键字符“$”代表参数，比如“$0”代表第一个参数。
        * 以下代码将输出：##Test: [Info] 2020-1-1-17:19:53.568 Hello my name is Tom, I am 12 years old.
        * */
        log.info("Hello my name is $0, I am $1 years old.", "Tom", 12);

        /*
        * 参数可以是对象，对象将被序列化为JSON字符串，并追加到合适的位置。
        * 以下代码将输出：##Test: [Debug] 2020-1-1-17:19:27.745 Received message from Tom, data is: {"role":1,"roleName":"Teacher"}
        * */
        let data = {role: 1, roleName: "Teacher"};
        log.debug("Received message from $0, data is: $1", "Tom", data);
    }
}

export default TestLog;