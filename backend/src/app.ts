import * as express from 'express';
import * as cors from 'cors';
import validateLogin from './database/Middlewares/login';
import loginController from './database/Controllers/loginController';
import teamController from './database/Controllers/teamController';
import matchController from './database/Controllers/matchController';
import validateMatch from './database/Middlewares/match';
import leaderboardController from './database/Controllers/leaderboardController';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  public routes() {
    this.getHttp();
    this.postHttp();
    this.patchHttp();
  }

  public getHttp() {
    this.app.get('/login/validate', loginController.checkLogin);
    this.app.get('/teams/:id', teamController.getById);
    this.app.get('/teams', teamController.getAll);
    this.app.get('/matches/?', matchController.getByProgress, matchController.getAll);
    this.app.get('/leaderboard/home', leaderboardController.getLeaderBoardHome);
    this.app.get('/leaderboard/away', leaderboardController.getLeaderBoardAway);
    this.app.get('/leaderboard', leaderboardController.getLeaderBoard);
  }

  public postHttp() {
    this.app.post('/login', validateLogin, loginController.login);
    this.app.post('/matches', validateMatch, matchController.createMatchInprogress);
  }

  public patchHttp() {
    this.app.patch('/matches/:id/finish', matchController.updateProgress);
    this.app.patch('/matches/:id', matchController.updateResults);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use(cors());
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
