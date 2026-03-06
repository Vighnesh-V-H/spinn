export type FunctionConfig = {
  id: string;
  retries?: number;
};

export type EventTrigger = {
  event: string;
};

type HandlerContext = {
  event: unknown;
  step: unknown;
};

export type Handler = (ctx: HandlerContext) => Promise<any>;
