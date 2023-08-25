const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
    check("email","Field cannot be empty").notEmpty(),
    check("password","Password should be longer than 4 and less than 20 characters").isLength({min:4, max:20}),
],controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER', 'ADMIN', 'BLOCK']), (req, res) => {
    if (req.isBlocked) {
        return res.status(403).json({ message: "User is blocked" });
    }
    controller.getUsers(req, res); // Call the getUsers function from the controller
});
// router.get('/users', controller.getUsers)
router.put('/users/:userId/block', controller.blockUser)
router.put('/users/block', controller.blockUsers);
router.put('/users/unblock', controller.unblockUsers);
router.delete('/users/:userId/delete', controller.deleteUser)


module.exports = router;