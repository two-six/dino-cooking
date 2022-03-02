import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/mod.ts';

const router = new Router();

router.put('/mod/makemod/:id', controller.makeMod);

export default router;