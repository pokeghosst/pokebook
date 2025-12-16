/* TypeScript file generated from PreferencesPlugin.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type getOptions = { readonly key: string };

export type setOptions = { readonly key: string; readonly value: string };

export type removeOptions = { readonly key: string };

export type getResult = { readonly value: (null | string) };

export type t = {
  readonly get: (_1:getOptions) => Promise<getResult>; 
  readonly set: (_1:setOptions) => Promise<void>; 
  readonly remove: (_1:removeOptions) => Promise<void>; 
  readonly clear: () => Promise<void>
};
