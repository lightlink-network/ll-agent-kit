import {
  isAIMessageChunk,
  isHumanMessageChunk,
  isToolMessageChunk,
} from "@langchain/core/messages";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";
import type { IterableReadableStream } from "@langchain/core/utils/stream";

export const streamLogger = async (
  stream: IterableReadableStream<StreamEvent>
) => {
  for await (const event of stream) {
    logEvent(event);
  }
};

const logEvent = (event: StreamEvent) => {
  if (event.event == "on_chain_stream" && event.data.chunk) {
    const chunk = event.data.chunk;

    if (chunk.output) {
      console.log("\n[Output]: ", chunk.output);
      return;
    }

    if (chunk.intermediateSteps) {
      const steps = chunk.intermediateSteps as IntermediateStep[];
      for (const step of steps) {
        console.log(`\n[Step]`, step.action.log.trimEnd());
        if (step.action.tool)
          console.log(
            formatNestedItems(
              [
                "Tool: " + step.action.tool,
                "Tool Input: " + JSON.stringify(step.action.toolInput),
                "Result: " + JSON.stringify(step.observation),
              ],
              "\t"
            )
          );
      }
      return;
    }

    if (chunk.input && event.name == "insertHistory") {
      console.log("\n[Input]: ", chunk.input);
      return;
    }

    if (chunk.agent_scratchpad) {
      for (const c of chunk.agent_scratchpad) {
        if (
          (isAIMessageChunk(c) ||
            isHumanMessageChunk(c) ||
            isToolMessageChunk(c)) &&
          c.content
        ) {
          // do nothing
        }
      }
      return;
    }
  }
};

interface IntermediateStep {
  action: {
    tool?: string;
    toolInput?: Record<string, any>;
    toolCallId?: string;
    log: string;
    messageLog: any[];
  };
  observation: string;
}

const formatNestedItems = (items: any[], prefix = "") => {
  const _items = items
    .filter((item) => item != undefined)
    .map((item) => JSON.stringify(item));

  let str = "";

  // for all items except the last one
  for (let i = 0; i < _items.length - 1; i++) {
    if (_items[i] != "") {
      str += `${prefix} ├─ ${_items[i]}\n`;
    }
  }
  // for the last item
  str += `${prefix} └─ ${_items[_items.length - 1]}`;
  return str;
};
