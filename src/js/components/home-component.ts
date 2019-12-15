import Component from '../models/component';
import RouteRequest from '../models/route-request';
import Client from '../client';

export default class HomeComponent implements Component {

  request: RouteRequest = null;

  client: Client = null;

  constructor(request: RouteRequest) {
    // console.log('Home Component', request);

    this.request = request;
    this.client = new Client();

    this.client.get(
      'https://reqres.in/api/users',
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        params: {
          id: 2,
          per_page: 10
        }
      }
    ).then(res => {
      console.log(res);
    });
  }

  render() {
    console.log('render');
  }

}