const Keycloak = require("keycloak-connect");
/**
 * Method to Login User
 * @param req
 * @param res
 */
const authLogin = async (req, res) => {
  try {
    const { email_id, user_password } = req.body;
    //   const userData = await getByEmailId(email_id);

    const keycloakConfig = {
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      bearerOnly: true,
      serverUrl: `${process.env.KEYCLOAK_SERVER_URL}`,
      realm: `${process.env.KEYCLOAK_REALM}`,
      credentials: {
        secret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      },
    };
    const keycloak = new Keycloak({}, keycloakConfig); // Initialize Keycloak instance
    const username = email_id;
    const password = user_password;
    keycloak.grantManager
      .obtainDirectly(username, password)
      .then((grant) => {
        res.json({
          message: "User Login Successful",
          status: true,
          access_token: grant.access_token.token,
          refresh_token: grant.refresh_token.token,
          user_id: grant.access_token.content.sub,
          role: grant.access_token.content?.realm_access?.roles,
        });
      })
      .catch((err) => {
        // Error occurred during authentication
        console.error("Authentication error:", err);
        res.status(401).json({
          message: "Authentication failed",
          status: false,
          access_token: null,
          refresh_token: null,
          user_id: null,
        });
      });
  } catch (error) {
    console.log("Error Occurred in User Login : ", error);
    res.status(500).json({
      message: "Internal Server error",
      status: false,
      access_token: null,
      refresh_token: null,
      user_id: null,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const lookupTypes = {
      status: true,
      message: "data Found",
    };
    res.send(lookupTypes);
  } catch (error) {
    console.log("Error in getUserData", error);
    res.json({
      status: true,
      message: error,
    });
  }
};

module.exports = { authLogin, getUserData };
