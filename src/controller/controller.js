const { User } = require("../models/index");

module.exports = {
  getApi: async (req, res) => {
    res.send("hello from the other side ");
  },

  signup: async (req, res) => {
    const createUser = User(req.body);
    const result = await createUser.save();
    console.log(result);
    res.send(result);
  },
};
