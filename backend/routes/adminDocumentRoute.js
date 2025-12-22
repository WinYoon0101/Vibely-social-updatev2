const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const router = express.Router();
const {
    getFilteredDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getLevels,
    getSubjectsByLevel,
    createLevel,
    createSubject
} = require("../controllers/adminDocumentController");

router.get("/levels", adminAuthMiddleware, getLevels);
router.get("/subjects/:levelId", adminAuthMiddleware, getSubjectsByLevel);

router.post("/levels", adminAuthMiddleware, createLevel);
router.post("/subjects", adminAuthMiddleware, createSubject);

router.route("/")
    .get(adminAuthMiddleware, getFilteredDocuments)
    .post(adminAuthMiddleware, createDocument);

router.route("/:id")
    .put(adminAuthMiddleware, updateDocument)
    .delete(adminAuthMiddleware, deleteDocument);

module.exports = router;
