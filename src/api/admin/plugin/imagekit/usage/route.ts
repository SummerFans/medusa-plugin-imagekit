import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import getUsageWorkflow from "../../../../../workflows/get-usage-workflow";

function getCurrentMonthDateRange() {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const startDate = `${year}-${month}-01`;

  // 将月份设置为下个月的第一天，然后减去1天
  let nextday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const endDate = `${year}-${month}-${nextday.getDate()}`;

  return {
    startDate: startDate,
    endDate: endDate
  };
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const d = getCurrentMonthDateRange();
  const result = await getUsageWorkflow(req.scope).run({
    input: {
      startDate: d.startDate,
      endDate: d.endDate
    }
  })
  res.json(result)

}
