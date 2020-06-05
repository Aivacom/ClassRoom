import zh_CN from "./zh_CN";
import zh_TW from "./zh_TW"
import en_US from "./en_US";
import en_UK from "./en_UK";

class LocaleFactory {
    load(language){
        let lan = language? language.toLowerCase():"zh_cn";

        switch (lan) {
            case "zh_cn":
                return zh_CN;
            case "zh_tw":
                return zh_TW;
            case "en_us":
                return en_US;
            case "en_uk":
                return en_UK;
            default:
                return zh_CN;
        }
    }
}

export default LocaleFactory;