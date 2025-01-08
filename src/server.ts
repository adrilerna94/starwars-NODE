import './loadEnvironment';
import app from './app';

const port = process.env.HOST_PORT ?? '3000';

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
