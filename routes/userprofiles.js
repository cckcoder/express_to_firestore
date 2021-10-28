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

router.get("/books/:id", async (req, res) => {
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());

  if (!id) {
    res.json([]);
  }

  userProfile.get().then((doc) => {
    if (!doc.data()["bookUrl"]) {
      let bookUrl = [];
      res.json(bookUrl);
    } else {
      res.send(doc.data()["bookUrl"]).status(200);
    }
  });
});

router.get("/article/:id", async (req, res) => {
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());

  if (!id) {
    res.json([]);
  }

  userProfile.get().then((doc) => {
    if (!doc.data()["articleUrl"]) {
      let articleUrl = [];
      res.json(articleUrl);
    } else {
      res.send(doc.data()["articleUrl"]).status(200);
    }
  });
});

router.get("/course/:id", async (req, res) => {
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());

  if (!id) {
    res.json([]);
  }

  userProfile.get().then((doc) => {
    if (!doc.data()["courseUrl"]) {
      let courseUrl = [];
      res.json(courseUrl);
    } else {
      res.send(doc.data()["courseUrl"]).status(200);
    }
  });
});


router.get("/podcast/:id", async (req, res) => {
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());

  if (!id) {
    res.json([]);
  }

  userProfile.get().then((doc) => {
    if (!doc.data()["podcastUrl"]) {
      let podcastUrl = [];
      res.json(podcastUrl);
    } else {
      res.send(doc.data()["podcastUrl"]).status(200);
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
  videoInfo.createAt = new Date().getTime();

  console.log(videoInfo.type)
  let id = req.params.id;
  let userProfile = userProfiles.doc(id.trim());
  let doc = await userProfile.get();
  if (!doc.exists) {
    res.status(404).send("No such document!");
  } else {
    switch (videoInfo.type) {
      case "video":
        if (!doc.data()["videoUrl"]) {
          userProfile.set({ videoUrl: [] }, { merge: true });
          userProfile.update({
            videoUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        } else {
          userProfile.update({
            videoUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        }
        break;
      case "book":
        if (!doc.data()["bookUrl"]) {
          userProfile.set({ bookUrl: [] }, { merge: true });
          userProfile.update({
            bookUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        } else {
          userProfile.update({
            bookUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        }
        break;
      case "article":
        if (!doc.data()["articleUrl"]) {
          userProfile.set({ articleUrl: [] }, { merge: true });
          userProfile.update({
            articleUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        } else {
          userProfile.update({
            articleUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        }
        break;
      case "course":
        if (!doc.data()["courseUrl"]) {
          userProfile.set({ courseUrl: [] }, { merge: true });
          userProfile.update({
            courseUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        } else {
          userProfile.update({
            courseUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        }
        break;
      case "podcast":
        if (!doc.data()["podcastUrl"]) {
          userProfile.set({ podcastUrl: [] }, { merge: true });
          userProfile.update({
            podcastUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        } else {
          userProfile.update({
            podcastUrl: firestore.FieldValue.arrayUnion(videoInfo),
          });
        }
        break;
    }
    res.send(videoInfo);
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
