export default class Utils {

  static requestPath(): string {
    return window.location.pathname;
  }

  static isSet(variable: any): boolean {
    return !this.isUndefined(variable) && !this.isNull(variable);
  }

  static isNull(variable: any): boolean {
    return Object.prototype.toString.call(variable) === '[object Null]';
  }

  static isUndefined(variable: any): boolean {
    return Object.prototype.toString.call(variable) === '[object Undefined]';
  }

}