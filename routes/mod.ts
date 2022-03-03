import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/mod.ts';

const router = new Router();

router.get('/mod/viewmod', controller.viewMod);
router.get('/mod/viewrec', controller.viewRec);
router.put('/mod/makemod/:id', controller.makeMod);
router.delete('/mod/removemod/:id', controller.removeMod);
router.post('/mod/comaccept/:id', controller.comAccept);
router.post('/mod/recaccept/:id', controller.recAccept);

export default router;