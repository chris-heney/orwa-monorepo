export default {
  routes: [{
    method: 'GET',
    path: '/data-corps',
    handler: 'data-corps.dataCorps',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division',
    handler: 'data-corps.dataCorpsDivision',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade',
    handler: 'data-corps.dataCorpsDivisionBrigade',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalion',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion/company',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalionCompany',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion/company/platoon',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalionCompanyPlatoon',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion/company/platoon/squad',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquad',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion/company/platoon/squad/soldier',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquadSoldier',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/data-corps/division/brigade/battalion/company/platoon/squad/soldier/medic/:mission',
    handler: 'data-corps.dataCorpsDivisionBrigadeBattalionCompanyPlatoonSquadSoldierMedic',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    }
  }
  ],
};
