import ImagekitModuleService from "../service";

declare module "@medusajs/framework/types" {
  export interface ModuleImplementations {
    imagekitModuleService: ImagekitModuleService;
  }
}