/* eslint-disable no-unused-vars */
/* eslint-disable strict */
/*global  StatusCode */ 
declare interface Iresponse {
  getMessage(): string;
  getData(): unknown;
  getStatusCode(): StatusCode;
}
