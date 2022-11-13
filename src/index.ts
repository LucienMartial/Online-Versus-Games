import express, { Express, Request, Response} from 'express';

const app: Express = express();
app.use(express.static(__dirname + "/client/dist"));
const port = 8080;

app.get('/', (req: Request, res: Response) => {
    //res.send('Express + TypeScript Server');
    res.sendFile(__dirname + "/client/dist/");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
