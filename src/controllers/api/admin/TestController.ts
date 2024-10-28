import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  Get,
  Post,
  Put,
  Delete,
} from "../../../decorators/swagger.decorator";

@ApiTags("Services")
export default class TestController {

  // @Get("/")
  // @ApiOperation("Get Services")
  // @ApiResponse(200, "List of services retrieved successfully")
  // @ApiResponse(500, "Internal Server Error")
  // public async index(req: Request, res: Response): Promise<void> {
  //   try {
  //     const services = await ServiceRepository.getByField({ isDeleted: false });
  //     res.status(200).json({ success: true, data: services });
  //   } catch (err: any) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Internal Server Error",
  //       error: err.message,
  //     });
  //   }
  // }

  // @Post("/")
  // @ApiOperation("Create a new service")
  // @ApiBody({ type: "object", properties: { name: { type: "string" } } })
  // @ApiResponse(201, "Service created successfully")
  // @ApiResponse(400, "Bad Request")
  // public async create(req: Request, res: Response): Promise<void> {
  //   try {
  //     const service = await ServiceRepo.create(req.body);
  //     res.status(201).json({ success: true, data: service });
  //   } catch (err: any) {
  //     res.status(400).json({
  //       success: false,
  //       message: "Bad Request",
  //       error: err.message,
  //     });
  //   }
  // }

  // @Put("/:id")
  // @ApiOperation("Update a service")
  // @ApiBody({ type: "object", properties: { name: { type: "string" } } })
  // @ApiResponse(200, "Service updated successfully")
  // @ApiResponse(404, "Service not found")
  // public async update(req: Request, res: Response): Promise<void> {
  //   try {
  //     const updatedService = await ServiceRepo.update(req.params.id, req.body);
  //     res.status(200).json({ success: true, data: updatedService });
  //   } catch (err: any) {
  //     res.status(404).json({
  //       success: false,
  //       message: "Service not found",
  //       error: err.message,
  //     });
  //   }
  // }

  // @Delete("/:id")
  // @ApiOperation("Delete a service")
  // @ApiResponse(200, "Service deleted successfully")
  // @ApiResponse(404, "Service not found")
  // public async delete(req: Request, res: Response): Promise<void> {
  //   try {
  //     await ServiceRepo.delete(req.params.id);
  //     res
  //       .status(200)
  //       .json({ success: true, message: "Service deleted successfully" });
  //   } catch (err: any) {
  //     res.status(404).json({
  //       success: false,
  //       message: "Service not found",
  //       error: err.message,
  //     });
  //   }
  // }
}
