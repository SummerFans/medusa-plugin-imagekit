import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import getUsageStep, { GetUsageStepInput } from "./steps/get-usage";

type WorkflowInput = GetUsageStepInput

const getUsageWorkflow = createWorkflow(
  "get-usage-workflow",
  function (input: WorkflowInput) {

    return new WorkflowResponse(getUsageStep(input))
  }
)

export default getUsageWorkflow
