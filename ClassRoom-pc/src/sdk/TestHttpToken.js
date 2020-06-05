import httpToken from "./HttpToken";

new httpToken().request()
    .then((token) => {
        console.log("Token is loaded: " + token);
    })
    .catch((error) => {
        console.log(JSON.stringify(error));
    });
