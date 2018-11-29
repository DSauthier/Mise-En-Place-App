const express = require("express");
const router = express.Router();


// const NutritionFacts = require("nutrition-facts");
const NutritionFacts = require("nutrition-facts").default;

const NF = new NutritionFacts(process.env.USDA_NDB_API_KEY);

// NF.searchFoods({
//   q: 'salted butter',
//   ds: 'Standard Reference'
// }).then(results => {
//   let mySelectedItem = results.list.item[0];
//   // Items are returned as a FoodItem instance
//   // allowing you to call 'getNutrition' directly on the instance.
//   mySelectedItem.getNutrition()
//     .then(nutritionReport => {
//       console.log(nutritionReport)
//     })
//     //     .catch(()=>{
//     //     })
//     // .catch(() => {
//     // })
// })

router.get("/foodTest", (req, res, next) => {
  NF.searchFoods({
    q: 'salted butter',
    ds: 'Standard Reference'
  }).then(results => {
    let mySelectedItem = results.list.item[0];
    // Items are returned as a FoodItem instance
    // allowing you to call 'getNutrition' directly on the instance.
    mySelectedItem.getNutrition()
      .then(nutritionReport => {
        // console.log(nutritionReport.nutrients[1].value)
      })
  })
});



module.exports = router;




// Axios??

// Alternatively, if you know the NDBNO off-hand
// you can call 'getNutrition' from the NF instance.

// NF.getNutrition('01001', 'b')
//   .then(nutritionReport => {
//     console.log(nutritionReport)
//   }).catch(err => {
//     console.log(err)
//   })