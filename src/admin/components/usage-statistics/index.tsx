import { UsageStatisticsData } from '../../../providers/file-imagekit/types'
import { formatUsageStatistics } from '../../utils'



export default function UsageStatistics({ data = {
  bandwidthBytes: 0,
  mediaLibraryStorageBytes: 0,
  videoProcessingUnitsCount: 0,
  extensionUnitsCount: 0,
  originalCacheStorageBytes: 0
} }: { data?: UsageStatisticsData }) {
  const usageArr = formatUsageStatistics(data)

  return (
    <div className="w-full p-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Usage this month</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {usageArr.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white dark:bg-zinc-800/50 px-4 py-5 shadow-sm sm:p-6">
            <dt title={item.name} className="truncate text-sm font-medium text-gray-500 dark:text-white/50">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white/80">
              {item.value}
              {item.unit&&<span className='pl-2 text-sm'>{item.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}