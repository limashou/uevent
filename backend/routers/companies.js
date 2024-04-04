const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const token_controller = require('../controllers/TokenController');
const upload = require("./multer");

//company
router.post('/create', token_controller.verifyToken, company_controller.createCompanies);
router.patch('/edit', token_controller.verifyToken, company_controller.editCompany);
router.delete('/delete/:id', token_controller.verifyToken, company_controller.deleteCompany);
router.patch('/logo', token_controller.verifyToken, upload.single('photo'), company_controller.companyLogoUpload);
router.get('/:company_id/logo', company_controller.companyLogo);
router.get('/all', company_controller.allCompanies);
router.get('/byFounder/:founder_id',company_controller.companiesByFounder);
//member
router.post('/member/invite', token_controller.verifyToken, company_controller.addMember);
router.post('/member/accept', token_controller.verifyToken, company_controller.acceptMember);
router.patch('/member/role' , token_controller.verifyToken, company_controller.changeRole);
router.delete('/member/delete/:id', token_controller.verifyToken, company_controller.ejectMember);
router.get('/member/:company_id',company_controller.allCompanyMember);
//news
router.post('/news/create', token_controller.verifyToken, company_controller.createNews);
router.patch('/news/edit', token_controller.verifyToken, company_controller.editNews);
router.delete('/news/delete/:id', token_controller.verifyToken, company_controller.deleteNews);
router.patch('/poster', token_controller.verifyToken, upload.single('poster'), company_controller.companyNewsPosterUpload);
router.get('/:news_id/poster', company_controller.companyNewsPoster);

module.exports = router;