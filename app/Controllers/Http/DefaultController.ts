export default class DefaultController {
  public async index() {
    return {
      status: 'OK',
      name: 'Treninoo API',
      description: 'Treninoo API è il backend di supporto per Treninoo.',
      documentation: 'https://github.com/c0c4i/treninoo-api',
    }
  }
}
