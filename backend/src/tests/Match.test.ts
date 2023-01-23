import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import MatchesModel from '../database/models/matchesModel';
import { equalTeams, findAllMock, invalidTeamFirst, invalidTeamSecond } from './mocks/MatchMock';
import { tokenMock } from './mocks/tokenMock';

chai.use(chaiHttp);

const { expect } = chai;

const bodyRequest = {
  homeTeamId: 16,
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

describe('Testes "Match"', () => {
  let chaiHttpResponse: Response;

   before(async () => {
      sinon
       .stub(MatchesModel, 'findAll')
       .resolves(findAllMock as unknown as MatchesModel[]);

       sinon
       .stub(MatchesModel, 'create')
       .resolves({ ...bodyRequest, inProgress: 1 } as unknown as MatchesModel);

       sinon
       .stub(MatchesModel, 'findOne')
       .resolves(findAllMock[0] as unknown as MatchesModel);
   });

   after(()=>{
      (MatchesModel.findAll as sinon.SinonStub).restore();
      (MatchesModel.create as sinon.SinonStub).restore();
      (MatchesModel.findOne as sinon.SinonStub).restore();
   });

  it('Teste GET em "/matches", sem query', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/matches')
      .send();
      expect(chaiHttpResponse.body.length).to.be.equal(48);
  });

  it('Teste GET em "/matches", com query true', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/matches?inProgress=true')
      .send();
      expect(chaiHttpResponse.body.length).to.be.equal(8);
  });

  it('Teste GET em "/matches", com query false', async () => {
    chaiHttpResponse = await chai
      .request(app).get('/matches?inProgress=false')
      .send();
      expect(chaiHttpResponse.body.length).to.be.equal(40);
  });

  it('Teste POST em "/matches" com token correto', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .send(bodyRequest).set('Authorization', tokenMock.token);
      expect(chaiHttpResponse.body).to.be.deep.equal({ ...bodyRequest, inProgress: 1 });
  });

  it('Teste POST em "/matches" com token inválido', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .send(bodyRequest).set('Authorization', '134786293692');
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Token must be a valid token' });
  });

  it('Teste POST em "/matches" com token correto e times iguais', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .send(equalTeams).set('Authorization', tokenMock.token);
      expect(chaiHttpResponse.body.message).to.be.deep.equal('It is not possible to create a match with two equal teams');
  });

  it('Teste POST em "/matches" com token correto e time da casa com id inválido', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .send(invalidTeamFirst).set('Authorization', tokenMock.token);
      expect(chaiHttpResponse.body.message).to.be.deep.equal('There is no team with such id!');
  });

  it('Teste POST em "/matches" com token correto e time de fora com id inválido', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .send(invalidTeamSecond).set('Authorization', tokenMock.token);
      expect(chaiHttpResponse.body.message).to.be.deep.equal('There is no team with such id!');
  });

  it('Teste PATCH em "/matches"', async () => {
    chaiHttpResponse = await chai
      .request(app).patch('/matches/1')
      .send();
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Updated!' });
  });

  it('Teste PATCH em "/matches"', async () => {
    chaiHttpResponse = await chai
      .request(app).patch('/matches/43/finish')
      .send();
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Finished' });
  });
});
