import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/mod.ts';

const router = new Router();

router.get('/mod/viewmod', controller.viewMod);
router.put('/mod/makemod/:id', controller.makeMod);
router.delete('/mod/removemod/:id', controller.removeMod);
router.post('/mod/comaccept/:id', controller.comAccept);

export default router;