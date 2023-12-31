const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const reviewImages = require('./review-images.js');
const spotImages = require('./spot-images.js');
const { restoreUser } = require('../../utils/auth.js');



//*******************************CODE FOR TESTING USER AUTH MIDDLEWARE ROUTES */************************* */
// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// // GET /api/restore-user
// const { restoreUser } = require('../../utils/auth.js');

// router.use(restoreUser);

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );
//********************************************************************************************** */
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingsRouter);
router.use('/review-images', reviewImages);
router.use('/spot-images', spotImages);
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
