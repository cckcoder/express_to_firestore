const express = require("express");
const router = express.Router();
const db = require("../firebaseconnect");
const userProfiles = db.collection("profile");

router.get("/", async (req, res) => {
  let profiles = [];
  const profilesData = await userProfiles.orderBy("username", "desc").get();
  profilesData.forEach((profile) => {
    let setProfile = {
      id: profile.id,
      ...profile.data(),
    };
    profiles.push(setProfile);
  });
  res.json(profiles);
});

router.post("/", async (req, res) => {
  let newProfile = {
    ...req.body.data,
  };

  await userProfiles.doc().set(newProfile);
  res.json(newProfile);
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body.data;
  let userData = [];

  let is_exist = await userProfiles
    .where("email", "==", email)
    .where("password", "==", password)
    .limit(1)
    .get();

  is_exist.forEach((profile) => {
    let setProfile = {
      ...profile.data(),
    };
    userData.push(setProfile);
  });

  if (userData.length == 0) {
    res.status(401).send("Invalid username or password");
  } else {
    res.json({
      result: true,
      message: "Login Successfull!",
      userData: { ...userData },
    });
  }
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let profileDoc = userProfiles.doc(id.trim());
  let profileUpdate = { ...req.body };
  await profileDoc.update(profileUpdate);

  res.json(profileUpdate);
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  await userProfiles.doc(id.trim()).delete();
  res.json({ msg: "delete seccessful!" });
});

module.exports = router;