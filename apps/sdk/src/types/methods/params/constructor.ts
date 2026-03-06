import type { EventTrigger, FunctionConfig, Handler } from "./createFunction";

export type ConstructorParam = {
  apiKey: string;
  callbackURL: string;
};

export type functions = {
  config: FunctionConfig;
  event: EventTrigger;
  handler: Handler;
};
