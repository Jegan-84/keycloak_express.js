const Keycloak = require("keycloak-connect");
const Jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    if (req.headers.authorization) {
      const keycloakConfig = {
        clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
        bearerOnly: true,
        serverUrl: `${process.env.KEYCLOAK_SERVER_URL}`,
        realm: `${process.env.KEYCLOAK_REALM}`,
        credentials: {
          secret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
        },
      };
      const keycloak = new Keycloak({}, keycloakConfig);
      // configure the request to your keycloak server
      keycloak.grantManager
        .validateAccessToken(token)
        .then((result) => {
          req.tokenInfo = result;
          if (result === false) {
            res.status(401).json({
              message: "Secret Token Invalid",
              authendication: "Unauthorized",
            });
          } else {
            const decoded = Jwt.decode(result);
            next();
          }
        })
        .catch((err) => {
          // Token is invalid
          res.status(401).json({ error: "Invalid token", details: err });
        });
    } else {
      // there is no token, don't process request further
      res.status(401).json({
        message: "Token is required",
        authendication: "Unauthorized",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  authMiddleware,
};
