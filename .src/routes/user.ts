import { Router, helpers } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import user from '../controllers/user.ts';

const router = new Router();

router.get('/users', user.getUsers);
router.get('/users/:userId', user.getUser);

export default router;