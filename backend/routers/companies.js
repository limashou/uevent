const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const {uploadCompany, uploadNews} = require("./multer");

//company
router.get('/', company_controller.allCompanies);
router.post('/create',  company_controller.createCompanies);
router.patch('/:company_id/edit',  company_controller.editCompany);
router.delete('/:company_id/delete', company_controller.deleteCompany);
router.get('/getById/:company_id',  company_controller.getCompany);
router.patch('/:company_id/logo',  uploadCompany.single('photo'), company_controller.companyLogoUpload);
router.get('/:company_id', company_controller.getById);
router.get('/:company_id/logo' ,company_controller.companyLogo);
router.get('/byFounder/:founder_id',  company_controller.companiesByFounder);
// router.post('/search', token_controller.verifyToken, company_controller.searchByCompanyName);
//member
router.post('/member/invite', company_controller.addMember);
router.post('/member/accept-invitation/:invitationCode', company_controller.acceptMember);
router.patch('/member/role' , company_controller.changeRole);
router.delete('/member/delete/:id', company_controller.ejectMember);
router.get('/:company_id/members', company_controller.allCompanyMember);
//news
router.post('/news/create', company_controller.createNews);
router.patch('/news/edit', company_controller.editNews);
router.delete('/news/delete/:id', company_controller.deleteNews);
router.patch('/poster', uploadNews.single('poster'), company_controller.companyNewsPosterUpload);
router.get('/:news_id/poster', company_controller.companyNewsPoster);

module.exports = router;