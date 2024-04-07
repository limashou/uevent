const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const token_controller = require('../controllers/TokenController');
const {uploadCompany, uploadEvent, uploadNews} = require("./multer");

//company
router.get('/', token_controller.verifyToken, company_controller.allCompanies);
router.post('/create', token_controller.verifyToken, company_controller.createCompanies);
router.patch(':company_id/edit', token_controller.verifyToken, company_controller.editCompany);
router.delete('/:company_id/delete', token_controller.verifyToken, company_controller.deleteCompany);
router.get('/getById/:company_id', token_controller.verifyToken, company_controller.getCompany);
router.patch('/logo', token_controller.verifyToken, uploadCompany.single('photo'), company_controller.companyLogoUpload);
router.get('/:company_id', token_controller.verifyToken, company_controller.getById);
router.get('/:company_id/logo', token_controller.verifyToken ,company_controller.companyLogo);
router.get('/byFounder/:founder_id', token_controller.verifyToken ,company_controller.companiesByFounder);
// router.post('/search', token_controller.verifyToken, company_controller.searchByCompanyName);
//member
router.post('/member/invite', token_controller.verifyToken, company_controller.addMember);
router.post('/member/accept-invitation/:invitationCode', token_controller.verifyToken, company_controller.acceptMember);
router.patch('/member/role' , token_controller.verifyToken, company_controller.changeRole);
router.delete('/member/delete/:id', token_controller.verifyToken, company_controller.ejectMember);
router.get('/member/:company_id', token_controller.verifyToken, company_controller.allCompanyMember);
//news
router.post('/news/create', token_controller.verifyToken, company_controller.createNews);
router.patch('/news/edit', token_controller.verifyToken, company_controller.editNews);
router.delete('/news/delete/:id', token_controller.verifyToken, company_controller.deleteNews);
router.patch('/poster', token_controller.verifyToken, uploadNews.single('poster'), company_controller.companyNewsPosterUpload);
router.get('/:news_id/poster',token_controller.verifyToken, company_controller.companyNewsPoster);

module.exports = router;