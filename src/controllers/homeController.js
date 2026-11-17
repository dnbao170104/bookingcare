import db from "../models/index";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log("Check data: ", JSON.stringify(data));
    return res.render("homepage.ejs", { data: data });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHomePage: getHomePage,
};
