const express = require("express");
const router = express.Router();
const User = require("./user.model");
const { generateSalt, hash, compare } = require("./index");

let salt = generateSalt(10);

/**
 * @swagger
 *  components:
 *      schemas:
 *         User:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - password
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of User
 *              name:
 *                  type: string
 *                  description: The User name in full
 *              email:
 *                  type: string
 *                  description: The User-email address
 *              password:
 *                  type: string
 *                  description: User password min 6 char
 *          example:
 *                 name: John Doe
 *                 email: johnny@gmail.co
 *                 password: johnyy123
 */

/**
 *@swagger
 * tags:
 *   name: User Login/Register
 *   description: API to manage your user password hashing.
 */

/**
 *@swagger
 * path:
 * /users/:
 *  get:
 *        summary: Get all Registered Users
 *        tags: [Users]
 *        responses:
 *            "200":
 *               description: Registered Users List
 *               content:
 *                    application/json:
 *                      schema:
 *                          $ref: './user.model'
 */

router.get("/users", async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).json({
      status: "success",
      users: users,
    });
  } catch (err) {
    console.log("Error", err.message);
  }
});

/**
 *@swagger
 * path:
 * /users/:id/:
 *  get:
 *        summary: Get a Registered User
 *        tags: [User]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The User Id
 *        responses:
 *            "200":
 *               description: Registered Users List
 *               content:
 *                    application/json:
 *                      schema:
 *                        $ref: './user.model'
 *            "404":
 *                description: User not found.
 */

router.get("/users/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (err) {
    console.log("Error", err.message);
  }
});

/**
 *@swagger
 * path:
 * /register/:
 *  post:
 *        summary: Register A New User
 *        tags: [User]
 *        requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                       $ref:    './user.model'
 *        responses:
 *            "200":
 *               description: User Registered
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: './user.model'
 */

router.post("/register", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await hash(req.body.password, salt),
    });
    let response = await user.save();
    res.status(200).json({
      status: "sucess",
      data: response,
    });
  } catch (err) {
    console.log("Error", err.message);
  }
});

module.exports = router;

/**
 *@swagger
 * path:
 * /login/:
 *  post:
 *        summary: Login A Registered User
 *        tags: [User]
 *        requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                       $ref:    '#'
 *        responses:
 *            "200":
 *               description: User Registered
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: './user.model'
 */

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        type: "Not Found",
        msg: "Wrong Login Details",
      });
    }
    let match = await compare(password, user.password);
    if (match) {
      res.status(200).json({
        status: "Success",
        msg: "User Logged In",
        data: user,
      });
    }
  } catch (err) {
    console.log("Error", err.message);
  }
});

/**
 *@swagger
 * path:
 * /users/:id/:
 *  delete:
 *        summary: Delete Registered User
 *        tags: [User]
 *        parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The User Id
 *        responses:
 *            "204":
 *               description: Delete was successful
 *            "404":
 *               description: User not found
 */

router.delete("/users/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      msg: "User Account Deleted Success",
    });
  } catch (err) {
    console.log("Error", err.message);
  }
});
