import hsa_js from "./HSA-JS"

class HSAFactory {
    newSDK(prop, type) {
        if (type === "js") {
            return new hsa_js(prop);
        }

        return new hsa_js(prop);
    };
}

export default HSAFactory;

