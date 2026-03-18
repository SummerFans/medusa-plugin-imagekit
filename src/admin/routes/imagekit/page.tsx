import { toast } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import LogoSquare from "../../icons/logo_square"
import { useLoaderData } from "react-router-dom"
import UsageStatistics from "../../components/usage-statistics"
import { UsageStatisticsData } from "../../../providers/file-imagekit/types"

declare const __BACKEND_URL__: string;

export async function loader(): Promise<{ useStatistics: UsageStatisticsData }> {

  const url = `${__BACKEND_URL__}/admin/plugin/imagekit/usage`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
  const { result } = await res.json();

  return { useStatistics: result }
}

const ImagekitPage = () => {
  const { useStatistics } = useLoaderData() as Awaited<ReturnType<typeof loader>>
  if (useStatistics.message) {
    toast.error(useStatistics?.message)
    return (<div className="flex flex-col items-center">
      <UsageStatistics />
    </div>)
  }

  return (
    <div className="flex flex-col items-center">
      <UsageStatistics data={useStatistics} />
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Imagekit",
  icon: LogoSquare,
})

export default ImagekitPage