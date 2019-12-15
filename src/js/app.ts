import Router from './router';
import AppRoute from './models/route';
import HomeComponent from './components/home-component';

const routes: Array<AppRoute> = [
  {
      path: '/',
      component: HomeComponent
  },
  {
      path: '/about',
      component: HomeComponent
  },
  {
      path: '/contact',
      component: HomeComponent
  },
  {
      path: '/users/{id}',
      component: HomeComponent
  },
  {
      path: '/users/{id}/edit',
      component: HomeComponent
  },
  {
      path: '/recipe/{slug}',
      component: HomeComponent
  },
  {
      path: '/recipe/{slug}/comment/{id}',
      component: HomeComponent
  }
];

class App {
  constructor() {
    new Router(routes);
  }
}

const app = new App();