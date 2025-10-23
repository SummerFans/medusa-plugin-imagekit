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

    const imagekitService: ImagekitModuleService = container.resolve(IMAGEKIT_MODULE);
    const cachingModuleService = container.resolve(
      Modules.CACHING
    )
    const usageStr = await cachingModuleService.get({ key: USAGE_CACHE_NAME });

    if (usageStr) {
      return new StepResponse(usageStr)
    }
    try {
      const result = await imagekitService.usageStatistics(startDate, endDate);
      await cachingModuleService.set({
            key: USAGE_CACHE_NAME,
            data: result,
            ttl:USAGE_CACHE_TTL
        })
      return new StepResponse(result);
    } catch (e) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, e.message);
    }

  }
)

export default getUsageStep;