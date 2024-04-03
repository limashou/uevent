const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const token_controller = require('../controllers/TokenController');

//company
router.post('/create', token_controller.verifyToken, company_controller.createCompanies);
router.patch('/edit', token_controller.verifyToken, company_controller.editCompany);
router.delete('/delete/:id', token_controller.verifyToken, company_controller.deleteCompany);
//member
router.post('/member/invite', token_controller.verifyToken, company_controller.addMember);
router.post('/member/accept', token_controller.verifyToken, company_controller.acceptMember);
router.patch('/member/role' , token_controller.verifyToken, company_controller.changeRole);
router.delete('/member/delete/:id', token_controller.verifyToken, company_controller.ejectMember);
//news
router.post('/news/create', token_controller.verifyToken, company_controller.createNews);
router.patch('/news/edit', token_controller.verifyToken, company_controller.editNews);
router.delete('/news/delete/:id', token_controller.verifyToken, company_controller.deleteNews);
module.exports = router;