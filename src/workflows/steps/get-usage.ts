import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { IMAGEKIT_MODULE } from "../../modules/imagekit";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import ImagekitModuleService from "../../modules/imagekit/service";


export type GetUsageStepInput = {
  startDate: string;
  endDate: string
}

const USAGE_CACHE_NAME = 'imagekit-usage-data'
const USAGE_CACHE_TTL = 60 * 5

const getUsageStep = createStep(
  "get-usage",
  async ({ startDate, endDate }: GetUsageStepInput, { container }) => {

    if (!startDate || !endDate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'missing parameters `startDate` and `endDate`'
      )
    }

    const imagekitService:ImagekitModuleService = container.resolve(IMAGEKIT_MODULE);
    const cacheModuleService = container.resolve(
      Modules.CACHE
    )
    const usageStr = await cacheModuleService.get(USAGE_CACHE_NAME);

    if (usageStr) {
      const usage = JSON.parse(usageStr as string)
      return new StepResponse(usage)
    }
    try {
      const result = await imagekitService.usageStatistics(startDate, endDate);
      await cacheModuleService.set(USAGE_CACHE_NAME, JSON.stringify(result), USAGE_CACHE_TTL);
      return new StepResponse(result);
    } catch (e) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, e.message);
    }

  }
)

export default getUsageStep;