const express = require('express');
const router = express.Router();
const Recipe = require('../models/RecipeModel');
const uploadCloud = require("../config/cloudinary.js");
const Book = require("../models/recipeBookModel");

// index recipe page-> show all recipes --==--=-=-=-=
router.get("/recipes", (req, res, next) => {
  Recipe.find()
    .then(allTheRecipes => {
      res.render("RecipesFolder/recipeIndex", { Recipes: allTheRecipes });
    })
    .catch(err => {
      next(err);
    });
  // }
});
// -=-=-=-=-=-==--=-==-show all recipes end-==--=-=-=-=-=

// =-=--=-==-=-Create recipe -=--==--=-==--==-
router.get("/recipes/new", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "sorry you must be logged in to create a recipe");
    res.redirect("/login");
  } else {
    Recipe.find()
      .then(allTheRecipes => {
        res.render("RecipesFolder/newRecipe", { allTheRecipes });
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post(
  "/recipes/recipes/create",
  uploadCloud.single("image"),
  (req, res, next) => {
    const newRecipe = req.body;
    newRecipe.author = req.user._id;

    if (req.file) {
      const image = req.file.url;
      newRecipe.image = image;
    }

    
    Recipe.create(newRecipe)
      .then(() => {
        res.redirect("/recipes");
      })
      .catch(err => {
        next(err);
      });
  }
);


// =--=-=-=-=-=Create recipe ends -=-=--==--=-==-

// =--=-=-==-=-=--=EDIT recipe starts=--=-=-=-=-==-=-


router.get("/recipes/:_id/edit", (req, res, next) => {
  Recipe.findById(req.params._id)
    .then(theRecipe => {
      res.render("RecipesFolder/editRecipe", { theRecipe: theRecipe });
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  "/recipes/:_id/update",
  uploadCloud.single("image"),
  (req, res, next) => {
    const updateAll = req.body;
    // updateAll.image = image;
    if (req.file) {
      const image = req.file.url;
      updateAll.image = image;
    }
    Recipe.findByIdAndUpdate(req.params._id, updateAll)

      .then(() => {
        // console.log("-=-==--=-=-=-==-"+theRecipe)
        res.redirect("/recipes/");
      })
      .catch(err => {
        next(err);
      });
  }
);

// =--=-=-=-=-=-=-=EDIT RECIPE ENDS=--==--=-=-=-=-=-=

// =-=--=-=-=-=show each recipe detail starts-==--=-=-=
router.get("/recipes/:index", (req, res, next) => {

  let canDelete = false;
  let canEdit = false;
  let theIndex = Number(req.params.index);
  let previous = theIndex - 1;
  let nextOne = theIndex +1;
  let canGoBack = true;
  // let theSearch;
Recipe.count()
.then((total)=>{
  // console.log("============================", canGoBack)
  if(req.params.index < 1){
    canGoBack = false;
  }

  if(nextOne>total-1){
    nextOne = false
  }

  Recipe.find({}, {}, { skip: theIndex, limit: 1 })
    .populate("author")
    .then(theRecipe => {
      theRecipe = theRecipe[0];
      if (req.user) {

        if (String(theRecipe.author._id) == String(req.user._id)) {
          canDelete = true;
        }
      }

      const theIngredients = theRecipe.ingredients[0].split("\n");
      theIngredients.shift();

      const theDirection = theRecipe.directions.split("\n");
      theDirection.shift();

      data = { theRecipe: theRecipe, canDelete: canDelete, canEdit: canEdit, theIngredients, theDirection, previous: previous, next: nextOne, canGoBack: canGoBack};
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%% ", total)
      res.render("RecipesFolder/recipeDetails", data);
    }).catch(err => {
      next(err);
    });
  })
  .catch(() => {

  })
});


// =--=-=-=-=-=show each recipe detail ends-=-=-=-=-=-=





// -==--=-=-=delete Recipe starts=--=-=-=-=-=
router.post("/recipes/:id/delete", (req, res, next) => {
  Recipe.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/recipes");
    })
    .catch(err => {
      console.log("error");
      next(err);
    });
});
// =-=--=-=-=-=delete recipe ends=--=-=-=-=-=
module.exports = router;
