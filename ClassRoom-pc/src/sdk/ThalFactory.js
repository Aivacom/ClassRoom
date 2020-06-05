import ThalWin from "./ThalWin";

class ThalFactory {
    new(prop, type) {
        switch (type) {
            case "win":
                return new ThalWin(prop);
            default:
                return new ThalWin(prop);
        }
    }
}

export default ThalFactory;