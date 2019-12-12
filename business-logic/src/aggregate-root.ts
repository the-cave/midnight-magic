import { default as isEmpty } from 'ramda/src/isEmpty';

// export interface EventMeta {
//   readonly type: string;
// }

export class AggregateRoot {
  // private readonly handlerMap: Map<string, string>;
  private readonly handlerMap: any[][];
  public readonly pendingEvents: any[];
  public state: object;

  constructor(
    private readonly handlerObject: object,
    initialState: object,
  ) {
    // this.handlerMap = new MapImpl();
    this.handlerMap = [];
    this.pendingEvents = [];
    this.state = initialState || {};
  }

  public on(eventKlass: any, handlerName: string) {
    for (const testPair of this.handlerMap) {
      if (testPair[0] === eventKlass) {
        // TODO: better error type
        throw new Error('duplicated event handling');
      }
    }
    this.handlerMap.push([eventKlass, handlerName]);
    // this.handlerMap[event.type] = handlerName;
  }

  public apply(...events: any[]) {
    const {
      handlerObject,
      handlerMap,
      pendingEvents,
    } = this;
    for (const event of events) {
      let handlerName = null;
      for (const testPair of handlerMap) {
        const [eventKlass, iteratingHandlerName] = testPair;
        if (!(event instanceof eventKlass)) {
          continue;
        }
        handlerName = iteratingHandlerName;
      }
      if (isEmpty(handlerName)) {
        continue;
      }
      const { [handlerName]: handler } = handlerObject;
      if (isEmpty(handler)) {
        continue;
      }
      this.state = handler.call(
        handlerObject,
        this.state,
        event,
      );
      pendingEvents.push(event);
    }
  }
}
