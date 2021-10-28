const express = require("express");
const { firestore, database } = require("firebase-admin");
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

router.get("/video/:id", async (req, res) => {
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());

  if (!id) {
    res.json([]);
  }

  userProfile.get().then((doc) => {
    if (!doc.data()["videoUrl"]) {
      let videoUrl = [];
      res.json(videoUrl);
    } else {
      res.send(doc.data()["videoUrl"]).status(200);
    }
  });
});

router.post("/", async (req, res) => {
  let newProfile = {
    ...req.body.data.formData,
  };
  let newUserProfile = [];
  console.log("...insert data");
  await userProfiles.doc().set(newProfile);
  const doc = await userProfiles
    .where("email", "==", newProfile.email)
    .where("password", "==", newProfile.password)
    .get();

  console.log("...setup data");
  doc.forEach((profile) => {
    let setProfile = {
      id: profile.id,
      ...profile.data(),
    };
    newUserProfile.push(setProfile);
  });

  console.log("...response back");
  if (newUserProfile) {
    res.json(newUserProfile).status(200);
  }
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
      id: profile.id,
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

router.post("/video/:id", async (req, res) => {
  console.log("...calling video");
  let videoInfo = {
    ...req.body.data,
  };
  videoInfo.type = "video";
  videoInfo.createAt = new Date().getTime();

  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());
  let doc = await userProfile.get();
  if (!doc.exists) {
    res.status(404).send("No such document!");
  } else if (!doc.data()["videoUrl"]) {
    userProfile.set({ videoUrl: [] }, { merge: true });
    userProfile.update({
      videoUrl: firestore.FieldValue.arrayUnion(videoInfo),
    });
  } else {
    userProfile.update({
      videoUrl: firestore.FieldValue.arrayUnion(videoInfo),
    });
  }

  res.send(videoInfo);
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
