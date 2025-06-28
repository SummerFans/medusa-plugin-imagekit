import ImagekitModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const IMAGEKIT_MODULE = "imagekit_service"

export default Module(IMAGEKIT_MODULE, {
  service: ImagekitModuleService,
})