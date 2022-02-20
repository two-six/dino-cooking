import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/user.ts';

const router = new Router();

router.get('/user/view', controller.view);
router.post('/user/login', controller.login);
router.post('/user/register', controller.register);
router.delete('/user/logout', controller.logout);

export default router;