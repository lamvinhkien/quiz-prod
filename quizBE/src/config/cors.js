require("dotenv").config();

const configCors = (app) => {
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
    })
}

module.exports = configCors