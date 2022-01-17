// https://basarat.gitbook.io/typescript/project/modules/globals

declare module '*.png' {
  const value: any;
  export = value;
}

declare namespace NodeJS {
  interface Global {
    _mongoClientPromise: Promise;
  }
}
