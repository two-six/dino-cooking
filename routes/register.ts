import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/register.ts';

const router = new Router();

router.post('/register', controller.register);

export default router;