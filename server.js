import pkg from 'express';
const express = pkg.default || pkg;

import path from 'path';
import { fileURLToPath } from 'url';

// ESM環境下では __dirname が使えないため、以下のように算出します
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 