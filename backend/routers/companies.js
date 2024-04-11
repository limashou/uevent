const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const {uploadCompany, uploadNews} = require("./multer");

//company
router.get('/', company_controller.allCompanies);
router.post('/create',  company_controller.createCompanies);
router.patch('/:company_id/edit',  company_controller.editCompany);
router.delete('/:company_id/delete', company_controller.deleteCompany);
router.patch('/:company_id/logo',  uploadCompany.single('photo'), company_controller.companyLogoUpload);
router.get('/:company_id', company_controller.getById);
router.get('/:company_id/byID',company_controller.getCompany);
router.get('/:company_id/logo' ,company_controller.companyLogo);
router.get('/byFounder/:founder_id',  company_controller.companiesByFounder);
// router.post('/search', token_controller.verifyToken, company_controller.searchByCompanyName);
//member
router.post('/:company_id/members/invite', company_controller.addMember);
router.post('/members/accept-invitation/:invitationCode', company_controller.acceptMember);
router.patch('/:company_id/members/:member_id/role' , company_controller.changeRole);
router.delete('/:company_id/members/:member_id/delete', company_controller.ejectMember);
router.get('/:company_id/members', company_controller.allCompanyMember);
//news
router.post('/:company_id/news/create', company_controller.createNews);
router.patch('/:company_id/news/edit', company_controller.editNews);
router.delete('/:company_id/news/delete/:id', company_controller.deleteNews);
router.patch('/:company_id/posterUpload/:news_id', uploadNews.single('poster'), company_controller.companyNewsPosterUpload);
router.get('/:company_id/poster/:news_id', company_controller.companyNewsPoster);
//notification
router.get('/:company_id/notification', company_controller.getNotification);
router.delete('/:company_id/notification/:notification_id/delete', company_controller.deleteNotification);
module.exports = router;