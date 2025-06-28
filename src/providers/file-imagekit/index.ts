import { ModuleProviderExports } from "@medusajs/types"
import { ImagekitFileService } from "./service"

const services = [ImagekitFileService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport