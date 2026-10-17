const express = require('express');
const router = express.Router();
const {
  getPapers,
  getPaperById,
  getPaperByPaperId,
  createPaper,
  updatePaper,
  deletePaper,
} = require('../controllers/paperController');

router.route('/')
  .get(getPapers)
  .post(createPaper);

router.route('/by-paper-id/:paperId')
  .get(getPaperByPaperId);

router.route('/:id')
  .get(getPaperById)
  .put(updatePaper)
  .delete(deletePaper);

module.exports = router;
