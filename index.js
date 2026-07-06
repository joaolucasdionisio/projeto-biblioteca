const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h2>Hello World!</h2>');
});

app.listen(3000, () => {
  console.log(`Servidor está rodando na porta http://localhost:3000`);
});