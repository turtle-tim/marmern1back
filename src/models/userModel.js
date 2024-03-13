const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      lowercase: true,
      trim: true,
      minlength: [true, "First name must be more than 2 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      lowercase: true,
      trim: true,
      minlength: [true, "First name must be more than 2 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          // email validation
          const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        },
        message: (props) =>
          `"${props.path}" must be a valid email. However we received ${props.value}`,
      },
    },
    secondaryEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          // email validation
          const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        },
        message: (props) =>
          `
        "${props.path}" must be a valid email. However we received ${props.value}
        `,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be more than 8 characters."],
      trim: true,
    },
    phone: {
      type: String,
      required: [false, "Phone number must be provided."],
      index: {
        partialFilterExpression: {
          phone: {
            $type: "string",
          },
        },
      },
      default: null,
    },
    active: {
      type: Boolean,
    },
    lastLoggedIn: {
      type: Date,
    },
    access: {
      type: String,
      required: [true, "access needs to be defined."],
    },
    caseWorkerType: {
      type: String,
    },
    unit: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/*
=============================================================================
Find a user by credentials
=============================================================================
*/
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw { message: "Unable to login", status: 401 };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw { message: "Unable to login", status: 401 };
  }

  if (!user.active || user.active === false) {
    throw { message: "This user is not active and can't login", status: 401 };
  }

  return user;
};
/*
=============================================================================
Modify returning user
=============================================================================
*/

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

/*
=============================================================================
Password Hash
=============================================================================
*/

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

/*
=============================================================================
Generate auth token with JWT
=============================================================================
*/

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

/*
=============================================================================
Duplicate Key error handling
=============================================================================
*/

const duplicateKeyErrorHandler = function (error, res, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Duplication error happened"));
  } else {
    next();
  }
};

userSchema.post("save", duplicateKeyErrorHandler);
userSchema.post("update", duplicateKeyErrorHandler);
userSchema.post("findOneAndUpdate", duplicateKeyErrorHandler);
userSchema.post("insertMany", duplicateKeyErrorHandler);

/*
=============================================================================
Creat model and export it
=============================================================================
*/

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
