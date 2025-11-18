const express = require('express');
const router = express.Router();


// placeholder auth endpoints — expand as needed
router.post('/login', (req, res) => {
res.json({ ok: true });
});


module.exports = router;