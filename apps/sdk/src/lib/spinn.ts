import type { EventTrigger, FunctionConfig, Handler } from "../types";

import type {
  ConstructorParam,
  functions,
} from "../types/methods/params/constructor";
import { api } from "./axios";

export class Spinn {
  private apiKey: string;
  public callbackURL: string;

  private functions: Array<{
    config: FunctionConfig;
    event: EventTrigger;
    handler: Handler;
  }> = [];

  constructor({ apiKey, callbackURL }: ConstructorParam) {
    this.apiKey = apiKey;
    this.callbackURL = callbackURL;
  }

  public createFunction(
    config: FunctionConfig,
    event: EventTrigger,
    handler: Handler,
  ) {
    this.functions.push({ config, event, handler });
  }

  public async register() {
    const metadata = this.functions.map((f) => ({
      ...f.config,
      event: f.event,
    }));

    await api.post("http://localhost:8080/registerfunction", {
      apiKey: this.apiKey,
      callbackURL: this.callbackURL,
      functions: metadata,
    });
  }
}
