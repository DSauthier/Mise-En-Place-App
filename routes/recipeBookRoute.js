const express = require("express");
const router = express.Router();
const Books = require("../models/recipeBookModel");
const Recipe = require("../models/RecipeModel")
const uploadCloud = require("../config/cloudinary.js");
const Book = require("../models/recipeBookModel");
// {{!-- / -=-=-=-=-=-==--=-==-show all recipes books starts-==--=-=-=-=-= --}}

router.get("/recipeBook", (req, res, next) => {
  console.log("HELLOOOOOOO")
  Books.find({author: req.user._id})
    .then(allBooks => {
      res.render("recipeBookFolder/recipeBookIndex", { allBooks: allBooks });
    })
    .catch(err => {
      next(err);
    });
  // }
});

// {{!-- / -=-=-=-=-=-==--=-==-show all recipes books ends-==--=-=-=-=-= --}}

// {{!-- / -=-=-=-=-=-==--=-==-create all recipes book starts-==--=-=-=-=-= --}}

router.get("/recipeBook/new", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "sorry you must be logged in to create a recipe book");
    res.redirect("/login");
  } else {
    Books.find()
      .then(allTheRecipes => {
        res.render("recipeBookFolder/newRecipeBook", { allTheRecipes });
      })
      .catch(err => {
        next(err);
      });
  }
});
router.post("/recipeBook/recipeBook/create",
  uploadCloud.single("image"), (req, res, next) => {
  const newRecipeBook = req.body;
  newRecipeBook.author = req.user._id;

  if (req.file) {
    const image = req.file.url;
    newRecipeBook.image = image;
  }

  Books.create(newRecipeBook)
    .then(() => {
      res.redirect("/recipeBook");
    })
    .catch(err => {
      next(err);
    });
});



// {{!-- / -=-=-=-=-=-==--=-==-create all recipes ends-==--=-=-=-=-= --}}


// =-=--=-=-=-=show each recipe book detail starts-==--=-=-=


router.get("/recipeBook/:index", (req, res, next) => {
  console.log("HELLO IM RECEIVING ")
  let canDelete = false;
  let canEdit = false;
  let theIndex = Number(req.params.index);
  let previous = theIndex - 1;
  let nextOne = theIndex + 1;

  Recipe.count({ author: req.user._id })
    .then(total => {
      // console.log(total);
      if (previous < 0) {
        previous = false;
      }
      if (nextOne > total - 1) {
        nextOne = false;
      }
  
  Books.find({ author: req.user._id })
    .populate("author")
    .populate("recipes")
    .then(theRecipeBook => {
      console.log("=-=-=-=-=-=-=-=-=-=-=", theRecipeBook[theIndex]._id);

      theRecipeBook = theRecipeBook[theIndex];
      if (req.user) {
        // console.log("--------- ", theRecipeBook.author._id);
        // console.log("=========", req.user._id);
        if (String(theRecipeBook.author._id) == String(req.user._id)) {
          canDelete = true;
        }
      }
      console.log("-------------------- ", theRecipeBook)
      data = {
        theRecipeBook: theRecipeBook,
        canDelete: canDelete,
        canEdit: canEdit
      };
      console.log("***************************************", data.theRecipeBook._id)
      res.render("recipeBookFolder/recipeBookDetails", data);
        }).catch(err => {
          next(err);
        });
    })
    .catch(() => {

    })
});
// =--=-=-=-=-=show each recipe book detail ends-=-=-=-=-=-=


// =--=-=-==-=-=--=EDIT recipe book starts=--=-=-=-=-==-=-


router.get("/recipeBook/:_id/edit", (req, res, next) => {
  Books.findById(req.params._id)
    .then(theRecipeBook => {
      Recipe.find()
        .then(allTheRecipes => {
          // console.log(allTheRecipes);

          res.render("recipeBookFolder/editRecipeBook", {
            theRecipeBook: theRecipeBook,
            recipes: allTheRecipes
          });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/recipeBook/:_id/update", (req, res, next) => {
  Books.findByIdAndUpdate(req.params._id, {
    $push: { recipes: req.body.recipeSelected }
  })
    .then(() => {
      // console.log("-=-==--=-=-=-==-"+theRecipe)
      res.redirect("/recipeBook");
    })
    .catch(err => {
      next(err);
    });
});

// =--=-=-=-=-=-=-=EDIT RECIPE ENDS=--==--=-=-=-=-=-=

// -==--=-=-=delete Recipe Book starts=--=-=-=-=-=
router.post("/recipeBook/:id/delete", (req, res, next) => {
  Books.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/recipeBook");
    })
    .catch(err => {
      console.log("error");
      next(err);
    });
});
// =-=--=-=-=-=delete recipe ends=--=-=-=-=-=

// =--=-=-=-==-=-=-SHOW EACH RECIPE INSIDE OF THE RECIPE BOOK ROUTE START -=-==--=-=-=-=

router.get("/recipeBook/:id/:index", (req, res, next) => {
  let canDelete = false;
  let canEdit = false;
  let theIndex = Number(req.params.index);
  let previous = theIndex - 1;
  let nextOne = theIndex + 1;
  let canGoBack = true;
  Recipe.count({ author: req.user._id })
    .then(total => {
      // console.log('=-=-=-=-=-=-=-',total);
      if (req.params.index < 1) {
        canGoBack = false;
      }
      if (nextOne > total - 1) {
        nextOne = false;
      }

      Book.findById(req.params.id).populate('recipes')
        .then(theBook => {
          const theRecipe = theBook.recipes[theIndex];
          // console.log("================ >>>>>>> ", theRecipe);
          // theRecipe = theRecipe[0];
          if (req.user) {
            // console.log("--------- ", theRecipe.author._id);
            // console.log("=========", req.user._id);

            if (String(theRecipe.author._id) == String(req.user._id)) {
              canDelete = true;
            }
          }
          const theIngredients = theRecipe.ingredients[0].split("\n");
          theIngredients.shift();

          const theDirection = theRecipe.directions.split("\n");
          theDirection.shift();

          data = { theRecipe: theRecipe, canDelete: canDelete, canEdit: canEdit, theIngredients, theDirection, previous: previous, next: nextOne, theRecipeBook: theBook, canGoBack: canGoBack };
          // console.log(data)
          res.render("recipeBookFolder/singleRecipeFromBook.hbs", data);
        }).catch(err => {
          next(err);
        });
    })
    .catch(() => {

    })
});

// =--=-=-=-==-=-=-SHOW EACH RECIPE INSIDE OF THE RECIPE BOOK ROUTE ENDS -=-==--=-=-=-=
module.exports = router;