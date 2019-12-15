import AppRoute from './models/route';
import InternalRoute from './models/internal-route';
import RouterParameter from './models/router-parameter';
import RouteRequest from './models/route-request';
import QueryParams from './query-params';
import Utils from "./utils";

export default class Router {

  routes: Array<InternalRoute> = [];

  query: QueryParams = null;

  constructor(routes: Array<AppRoute>) {
    // console.log('Router');

    this.query = new QueryParams();

    this.addListeners();

    this.processRoutes(routes);

    this.findActiveRoute();
  }

  private processRoutes(routes: Array<AppRoute>): void {
    routes.forEach((r: AppRoute) => {
      let route: InternalRoute = {
        uri: r.path,
        component: r.component,
        parameters: this.processParameters(r.path),
        regExp: null,
        current: false
      };

      this.processRegExp(route);

      this.routes.push(route);
    });

    // console.log(this.routes);
  }

  private processParameters(uri: any): Array<RouterParameter> {
    let parameters: Array<RouterParameter> = [];
    let sn = 0;

    if (this.containsParameter(uri)) {
      uri.replace(/{\w+}/g, (parameter: any) => {
        sn++;

        parameter.replace(/\w+/, (parameterName: any) => {
          let obj: any = {};

          obj[parameterName] = {
            sn: sn,
            regExp: '([^\\/]+)', // catch any word except '/' forward slash
            value: null
          };

          parameters.push(obj as RouterParameter);
        });
      });
    }

    return parameters;
  }

  private containsParameter(uri: string): boolean {
    return uri.search(/{\w+}/g) >= 0;
  }

  private processRegExp(route: InternalRoute): InternalRoute {
    let regExp = route.uri;

    // escape special characters
    regExp = regExp.replace(/\//g, "\\/");
    regExp = regExp.replace(/\./g, "\\.");
    regExp = regExp.replace("/", "/?");

    if (this.containsParameter(route.uri)) {

      //replace uri parameters with their regular expression
      regExp.replace(/{\w+}/g, (parameter) => {
        let parameterName = parameter.replace("{", "");
        parameterName = parameterName.replace("}", "");

        route.parameters.some((i) => {
          if (i[parameterName] !== undefined) {
            regExp = regExp.replace(parameter, i[parameterName].regExp)
            return regExp;
          }
        });

        return parameter;
      });
    }

    regExp = `^${regExp}$`;

    route.regExp = new RegExp(regExp);

    return route;
  }

  private addListeners(): void {
    window.history.pushState = (f => function pushState() {
      const ret = f.apply(this, arguments);

      window.dispatchEvent(new Event('pushstate'));
      window.dispatchEvent(new Event('locationchange'));

      return ret;
    })(history.pushState);

    window.history.replaceState = (f => function replaceState() {
      const ret = f.apply(this, arguments);

      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));

      return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });

    window.addEventListener('locationchange', this.findActiveRoute.bind(this));

    // Utilities.addListenersOnAnchors(document.getElementsByTagName('a'));
  }

  private processRequestParameters(route: InternalRoute): { [key: string]: string } {
    let routeMatched = Utils.requestPath().match(route.regExp);

    if (!routeMatched) return;

    let param: { [key: string]: string } = {};

    routeMatched.forEach((value, index) => {
      if (index !== 0) {
        let key = Object.getOwnPropertyNames(route.parameters[index - 1]);
        param[key[0]] = value;
      }
    });

    return param;
  }

  private findActiveRoute(): void {
    let found = false;

    this.routes.some((route) => {
      if (Utils.requestPath().match(route.regExp)) {
        route.current = true;
        found = true;

        let request: RouteRequest = {
          param: null,
          query: null,
          uri: null
        };

        request.param = this.processRequestParameters(route);
        request.query = this.query;
        request.uri = window.location.pathname;

        // console.log('route found', route, request);

        new route.component(request);
      }
    });

    if (!found) {
      console.log('route not found')
    }
  }

}