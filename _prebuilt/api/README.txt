DSCC Sara chatbot — Hostinger setup (one-time)
================================================

1) In Hostinger File Manager open: public_html/api/
2) Create a new file named: config.php
3) Paste exactly this (replace the placeholder with your real OpenAI key):

<?php define('OPENAI_API_KEY', 'sk-REPLACE-WITH-YOUR-OPENAI-KEY'); ?>

4) Save. Test by opening https://dsccsaudia.com  and clicking the chatbot.

Notes:
- config.php is NEVER committed to GitHub. It lives only on the Hostinger server.
- Apache executes PHP, so even if someone visits /api/config.php they get a blank page (not your key).
- To change the OpenAI model, add: define('DSCC_OPENAI_MODEL', 'gpt-4o-mini');
- Default model: gpt-4o-mini (cheap + fast). For higher quality: gpt-4o.
