import Utils from './utils';

export default class QueryParams {

  private keys: Array<string> = [];

  private queries: Array<{ [key: string]: string }> = [];

  private queryString: string;

  constructor(url: string = null) {
    // console.log('Query Params');

    this.queryString = url ? url : window.location.search;

    window.addEventListener('locationchange', (e) => {
      let event: any = e.currentTarget;

      this.queryString = event.location.search;
      this.keys = [];
      this.queries = [];

      return this.init(); // re run this class again
    });

    this.init();
  }

  private init() {
    if (this.queryString) {
      let queryArray = this.queryString.slice(1).split("&");

      queryArray.forEach(query => {
        let obj: { [key: string]: string } = {};
        let q = query.split('=');

        const key = this.decodeKey(q[0]);
        const value = this.decode(q[1]);

        this.keys.push(key);

        obj[key] = q.length > 1 ? value : ''; // return true if search query has no value

        this.queries.push(obj);
      });
    }
  }

  private decode(value: string): string {
    return decodeURIComponent(value);
  }

  private decodeKey(key: string): string {
    return decodeURIComponent(key.split(' ').join(''));
  }

  private getParam(key: string, index: number = null): string {
    let param: string = null;

    if (index) {
      param = this.queries[index][key];
    } else {
      this.queries.some(query => {
        if (query.hasOwnProperty(key)) return param = query[key];
      });
    }

    return param;
  }

  private paramsToString(): string {
    if (this.keys.length === 0) return '';

    let string = '?';

    this.keys.forEach((key, index) => {
      let value = this.getParam(key, index) === '' ? '' : `=${this.getParam(key, index)}`;

      string += index === 0 ? key + value : `&${key + value}`;
    });

    return string;
  }

  public getKeys(): Array<string> {
    return this.keys;
  }

  public hasKey(key: string): boolean {
    let k = this.decodeKey(key);

    return !!(this.keys.length > 0 && this.getParam(k));
  }

  public getKey(key: string): string {
    let k = this.decodeKey(key);

    return this.hasKey(k) ? this.getParam(k) : null;
  }

  public getAllKey(key: string): Array<string> {
    let k = this.decode(key);

    return this.hasKey(k) ? this.getParam(k).split(',') : [];
  }

  public appendKey(key: string, value: string): string {
    let k = this.decodeKey(key);
    let v = Utils.isSet(value) ? this.decode(value) : '';

    if (this.hasKey(k)) {
      this.setKey(k, v);
      return;
    }

    let index = this.keys.push(k) - 1;

    this.queries.push({[k]: v});

    this.queryString = this.paramsToString();

    window.history.pushState('', '', this.queryString);

    return this.getParam(k, index);
  }

  public setKey(key: string, value: string): string {
    let k = this.decodeKey(key);
    let v = Utils.isSet(value) ? this.decode(value) : '';

    let index = this.keys.indexOf(k);

    if (index !== -1) {
      this.keys[index] = k;
    } else {
      index = this.keys.push(key) - 1;
    }

    this.queries[index] = {[k]: v};

    this.queryString = this.paramsToString();

    window.history.pushState('', '', this.queryString);

    return this.getParam(k, index);
  }

  public removeKey(key: string): boolean {
    let k = this.decodeKey(key);

    if (!this.hasKey(k)) return this.hasKey(k); // definitely returns false if key doesn't exist

    let index = this.keys.indexOf(k);

    this.keys.splice(index, 1);
    this.queries.splice(index, 1);

    this.queryString = this.paramsToString();

    window.history.pushState('', '', this.queryString === '' ? Utils.requestPath() : this.queryString);

    return true;
  }

}