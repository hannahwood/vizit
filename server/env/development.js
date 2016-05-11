var oauth = require('../../oauth');
module.exports = {
   "DATABASE_URI": "mongodb://localhost:27017/vizit",
   "SESSION_SECRET": oauth.SESSION_SECRET,
   "GOOGLE": oauth.GOOGLE,
   "FACEBOOK": oauth.FACEBOOK
};