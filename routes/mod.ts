import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/mod.ts';

const router = new Router();

router.get('/mod/viewmod', controller.viewMod);
router.get('/mod/viewrec', controller.viewRec);
router.get('/mod/viewcom', controller.viewCom);
router.put('/mod/makemod/:id', controller.makeMod);
router.delete('/mod/removemod/:id', controller.removeMod);
router.post('/mod/comaccept/:id', controller.comAccept);
router.post('/mod/recaccept/:id', controller.recAccept);
router.delete('/mod/comdecline/:id', controller.comDecline);
router.delete('/mod/recdecline/:id', controller.recDecline);

export default router;