exports.checkField = function (json, fieldName) {
    if (!json) {
        return {success: false, error: "Bad json: json is empty"};
    }
    if (!json.hasOwnProperty(fieldName)) {
        return {
            success: false,
            error: "Bad json, does not have filed: " + fieldName + ". Json is:" + JSON.stringify(json)
        };
    }

    if (json[fieldName] == null) {
        return {success: false, error: "Bad json, field '" + fieldName + "' is empty."};
    }

    return {success: true};
};