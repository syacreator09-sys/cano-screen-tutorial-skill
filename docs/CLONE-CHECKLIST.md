# Clone checklist

After cloning on each computer:

```bash
npm install
npm run init
npx playwright install chromium
npm run verify
node bin/cano-screen.js doctor
node bin/cano-screen.js capture examples/image-generator.request.json --mock
```

Before live:

- configure allowed domains;
- authorize a demo session if needed;
- review redaction selectors;
- use a demo account;
- inspect video, screenshots and trace before sharing.
