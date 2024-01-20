"use strict";
require('dotenv').config();
const axios = require("axios")


//...............................................................................................
//Note when all the testing is done I have to add token verificarion so only legit user can access 
//................................................................................................


const getFood = async (req, res) => {
    try{ 
        const response = await axios.get(
            `https://api.edamam.com/api/food-database/v2/parser?ingr=${req.params.query}&app_id=${process.env.APPFOOD_ID}&app_key=${process.env.APPFOOD_KEY}`
        )
        console.log(response.data);
        res.json(response.data);
    }catch(error) {
        console.log(error);
    }
}

module.exports = {getFood};