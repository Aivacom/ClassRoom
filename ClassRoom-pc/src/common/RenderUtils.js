exports.getImage = function (url) {
    let path = process.env.NODE_ENV === 'development'
        ? process.execPath.substring(0, process.execPath.length - 'node_modules/electron/dist/electron.exe'.length)
        : process.resourcesPath;

    path = path + "/static/" + url;

    path = path.replace(/\\/g, '/');
    return path;
};