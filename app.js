import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.get('/', (req, res, next) => {
  res.send('Hello graphql project');
});

app.listen(3000, () => {
  console.log('listen port 3000');
});
