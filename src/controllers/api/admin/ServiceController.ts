import { ServiceRepository } from "../../../repository/ServiceRepository";
import { Request, Response } from 'express';
import Service from "../../../models/Service";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  servicePaginateSchema,
} from "../../../validations/service.validation";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  Delete,
  Get,
  Post,
  Put,
} from "../../../decorators/swagger.decorator";
const ServiceRepo = new ServiceRepository();

@ApiTags("Services")
export default class ServiceController {
  @Get("/service")
  @ApiOperation("Get Services")
  @ApiResponse(200, "List of services retrieved successfully")
  @ApiResponse(500, "Internal Server Error")
  public async index(req: Request, res: Response): Promise<void> {
    try {
      // const services = await Service.find()
      const services = await ServiceRepo.getByField({ isDeleted: false });
      res.status(200).json({ success: true, data: services });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  @Post("/service/create")
  @ApiOperation("Get Services")
  @ApiBody({ type: "object", properties: { name: { type: "string" }, description: { type: "string" } } })
  @ApiResponse(200, "List of services retrieved successfully")
  @ApiResponse(500, "Internal Server Error")
  public async store(req: Request, res: Response): Promise<void> {
    const { error, value } = serviceCreateSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
      return;
    }

    try {
      const { name, description, status, isDeleted } = value;

      // const newService = new Service({
      //     name,
      //     description,
      //     status,
      //     isDeleted
      // });

      // await newService.save();

      const saveData = await ServiceRepo.save(value);

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: saveData,
      });
    } catch (err: any) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Failed to create Service",
        error: err.message,
      });
    }
  }

  // Show a Service by ID

  @Get("/service/details/:id")
  @ApiOperation("Service Details")
  @ApiResponse(200, "Service Details fetch successfully")
  @ApiResponse(404, "Service not found")
  public async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // const service = await Service.findById(id)

      const service = await ServiceRepo.getById(id);
      if (service) {
        res.status(200).json({ success: true, data: service });
      } else {
        res.status(404).json({ success: false, message: "Service not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }

  @Put("/service/update/:id")
  @ApiOperation("Update a service")
  @ApiBody({ type: "object", properties: { name: { type: "string" }, descriptiion: { type: "string" } } })
  @ApiResponse(200, "Service updated successfully")
  @ApiResponse(404, "Service not found")
  public async update(req: Request, res: Response): Promise<void> {
    const { error, value } = serviceUpdateSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
      return;
    }

    try {
      const { id } = req.params;
      const updateData = { ...value };

      // const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      //     new: true,
      // })

      const updatedService = await ServiceRepo.updateById(id, updateData);

      if (updatedService) {
        res.status(200).json({
          success: true,
          message: "Service updated successfully",
          data: updatedService,
        });
      } else {
        res.status(404).json({ success: false, message: "Service not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update Service",
        error: err.message,
      });
    }
  }

  // status change a service by ID
  @Get("/service/status-change/:id")
  @ApiOperation("Status change of a service")
  @ApiResponse(200, "Service Status change successfully")
  @ApiResponse(404, "Service not found")
  public async statusChange(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (id) {
        const validService = await ServiceRepo.getById(id);
        if (!validService) {
          res
            .status(400)
            .json({ success: false, message: "Invalid Service ID" });
          return;
        }

        const newStatus =
          validService.status === "Active" ? "Inactive" : "Active";

        // Update the service status
        const updatedService = await ServiceRepo.updateById(id, {
          status: newStatus,
        });

        if (updatedService) {
          res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: updatedService,
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Service not updated" });
          return;
        }
      } else {
        res.status(404).json({ success: false, message: "Service not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update Service",
        error: err.message,
      });
    }
  }

  @Delete("/service/delete/:id")
  @ApiOperation("Delete a service")
  @ApiResponse(200, "Service deleted successfully")
  @ApiResponse(404, "Service not found")
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (id) {
        const validService = await ServiceRepo.getById(id);
        if (!validService) {
          res
            .status(400)
            .json({ success: false, message: "Invalid Service ID" });
          return;
        }
        // const updatedService = await Service.findByIdAndUpdate(id, { isDeleted: true }, {
        //     new: true,
        // })

        const updatedService = await ServiceRepo.updateById(id, {
          isDeleted: true,
        });
        if (updatedService) {
          res.status(200).json({
            success: true,
            message: "Service deleted successfully",
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Service not deleted" });
          return;
        }
      } else {
        res.status(404).json({ success: false, message: "Service not found" });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  }


  @Post("/service/get-all")
  @ApiOperation("Get All Services")
  @ApiBody({ type: "object", properties: { page: { type: "number" }, pageSize: { type: "number" } } })
  @ApiResponse(200, "List of services retrieved successfully")
  @ApiResponse(500, "Internal Server Error")
  public async serviceGetAll(req: Request, res: Response): Promise<void> {
    const { error, value } = servicePaginateSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
      return;
    }
    try {
      const { page, pageSize } = value;
      const { services, totalCount, totalPages } =
        await ServiceRepo.getAllService(page, pageSize);

      res.status(200).json({
        success: true,
        data: services,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: pageSize,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update Service",
        error: err.message,
      });
    }
  }
}
