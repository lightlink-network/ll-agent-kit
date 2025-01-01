import { Calculator } from "@langchain/community/tools/calculator";
import type { StructuredToolInterface } from "@langchain/core/tools";
import { z } from "zod";

type ZodObjectAny = z.ZodObject<any, any, any, any>;
