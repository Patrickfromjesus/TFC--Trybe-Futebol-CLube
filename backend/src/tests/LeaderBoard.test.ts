import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import MatchesModel from '../database/models/matchesModel';
import { leaderboardAwayMock, leaderboardHomeMock, leaderboardMock, matchesLeadeboardMock } from './mocks/LeaderBoardMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes "LeaderBoard"', () => {
  let chaiHttpResponse: Response;

   before(async () => {
      sinon
       .stub(MatchesModel, 'findAll')
       .resolves(matchesLeadeboardMock as unknown as MatchesModel[]);
   });

   after(() => {
     (MatchesModel.findAll as sinon.SinonStub).restore();
   });

  it('Teste GET para "/leaderboard/home".', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/leaderboard/home')
      .send();
      expect(chaiHttpResponse.body).to.deep.equal(leaderboardHomeMock);
  });

  it('Teste GET para "/leaderboard/away".', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/leaderboard/away')
      .send();
      expect(chaiHttpResponse.body).to.deep.equal(leaderboardAwayMock);
  });

  it('Teste GET para "/leaderboard".', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/leaderboard')
      .send();
      expect(chaiHttpResponse.body).to.deep.equal(leaderboardMock);
  });
});