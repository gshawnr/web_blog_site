require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");

const { getPosts, getPost, createPost } = require(__dirname + "/models/post");
const { User } = require("./models/user");

const app = express();

// MIDDLEWARE
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Auth
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: process.env.SESSION_COLLECTION,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user.id); // serialize user info
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// ROUTES
app.route("/").get(async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const posts = await getPosts(userId);
    res.render("home", { posts });
  } else {
    res.render("home", { posts: [] });
  }
});

app.route("/about").get((req, res) => {
  res.render("about");
});

app
  .route("/compose")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render("compose", {});
    } else {
      res.redirect("/signin");
    }
  })
  .post(async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user.id;
        const { postTitle, postBody } = req.body;
        await createPost({ postTitle, postBody, userId });
        res.redirect("/");
      } else {
        res.redirect("/signin");
      }
    } catch (err) {
      console.log("Error creating post: ", err);
      res.redirect("/compose");
    }
  });

app.route("/contact").get((req, res) => {
  res.render("contact");
});

app
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.passpord,
    });
    req.login(user, (err) => {
      if (err) {
        console.log("signin error: ", err);
        res.redirect("/");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
        });
      }
    });
  });

app.route("/signout").get((req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log("signout error: ", err);
      }
    });
  }
  res.redirect("/");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log("register error: ", err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/compose");
          });
        }
      }
    );
  });

app.route("/posts/:postId").get(async (req, res) => {
  try {
    const id = req.params.postId;
    const post = await getPost({ _id: id });

    if (post) {
      res.render("post", { title: post.postTitle, post: post.postBody });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log("Error fetching data", err);
    res.redirect("/");
  }
});

// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
