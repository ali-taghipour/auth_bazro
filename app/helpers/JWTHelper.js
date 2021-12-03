const jwt = require("jsonwebtoken");

exports.sign = async (json_values, expiresIn = 3600 * 2) => {
  return await jwt.sign(json_values,
    process.env.JWT_SECRET,
    {
      // expiresIn: process.env.expiresIn
      expiresIn: expiresIn
    }
  );
}

const verify = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
        if (err) reject(err)
        resolve(decodeToken)
      })
    } catch (e) {
      reject(e)
    }
  })
}

exports.verify = verify

exports.decode = async (token) => {
  // return await jwt.decode(token, process.env.JWT_SECRET);
  return await verify(token);
}

exports.destroy = async (token) => {
  return;
}


