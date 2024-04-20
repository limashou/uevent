const company_controller = require("../controllers/CompaniesController");
const {uploadNews} = require("./multer");
const Router = require('express')
const validateRequest = require("../middleware/validateRequest");
const {companyNewsValidationChain} = require("../validators/news");
const router = new Router;

router.patch('/:news_id/edit', companyNewsValidationChain, validateRequest, company_controller.editNews);
router.delete('/:news_id/delete', company_controller.deleteNews);
router.patch('/:news_id/posterUpload', uploadNews.single('photo'), company_controller.companyNewsPosterUpload);
router.get('/:news_id/poster', company_controller.companyNewsPoster);

module.exports = router;