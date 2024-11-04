import { Request, Response } from "express";
import { branchCreateSchema, branchUpdateSchema } from "../../../validations/branch.validadtion";
import { BrachRepository } from "../../../repository/branchRepository";
import { IResponse } from "../../../interfaces/IResponse";
import mongoose from "mongoose";
const branchRepo = new BrachRepository();


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


interface PaginationRequest {
    page?: number;
    pageSize?: number;
}
@ApiTags("Branch")
export default class BrachController {
    @Get("/branch")
    @ApiOperation("Get Branch")
    @ApiResponse(200, "List of Branch retrieved successfully")
    @ApiResponse(400, "Bad Requiest")
    @ApiResponse(500, "Internal Server Error")
    public async index(req: Request, res: Response): Promise<void> {
        try {

            const { page = 1, pageSize = 10 } = req.body as PaginationRequest;

            const pageNumber = parseInt(page as unknown as string, 10) || 1;
            const pageSizeNumber = parseInt(pageSize as unknown as string, 10) || 10;

            const result = await branchRepo.getAllBranch(pageNumber, pageSizeNumber);
            res.status(200).json({ success : true, message:"View Branch List",data : result.branch,totalcout:result.totalCount, totalPage:result.totalPages})
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ success: false, message: err.message })
        }
    }

    @Post("/branch/create")
    @ApiOperation("Insert a Branch")
    @ApiBody({ type: "object", properties: {
        name: { type: 'string' },
        desc: { type: 'string' },
      } })
    @ApiResponse(200, "Branch data Inserted successfully")
    @ApiResponse(400, "Bad Requiest")
    @ApiResponse(500, "Internal Server Error")
    public async store(req: Request, res: Response): Promise<void> {

        const { error, value } = branchCreateSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, message:error.details[0].message})
            return;
        }

        // console.log(value)
        try {
            const { name, desc } = value;

            const checkBranch = await branchRepo.getByField({ name: { $regex: `^${name.trim()}$`, $options: "i"}, 'isDeleted': false });
            
            if (checkBranch) {
                res.status(400).json({ success: false, message:"Branch name is already exist" })
                return
            }
           
            const branchData = await branchRepo.save({name, desc});

            if(!branchData){
                res.status(400).json({ success: false, message:"Something went wrong"})
                return;
            }

            res.status(200).send({ success : true, message:"Branch created successfully", data : branchData})
        }catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message:err.message })
        }
    }

    // Show a Brunch by ID
    public async show(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if(!mongoose.isValidObjectId(id)){
                res.status(400).json({ success: false, message:"Branch id is not valid"})
                return;
            }

            const branch = await branchRepo.getById(id)

            if (branch) {
                res.status(200).json({ success: true, message:"Branch data  Fetch sucessfully", data: branch})
                return
            } else {
                res.status(400).json({ success: false, message:"Something went wrong"})
                return;
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message })
        }
    }

    @Put("/branch/:id")
    @ApiOperation("Update a Branch data")
    @ApiBody({ type: "object", properties: {
        name: { type: 'string' },
        desc: { type: 'string' },
      } })
    @ApiResponse(200, "Branch Data updated successfully")
    @ApiResponse(404, "Branch Data not found")
    @ApiResponse(500, "Internal Server Error")
    // Update a Brunch by ID
    public async update(req: Request, res: Response): Promise<void> {
        const { error, value } = branchUpdateSchema.validate(req.body);
        if (error) {
              res.status(200).json({ success: false, message: error.details[0].message})
              return;
        }

        try {
            const { id } = req.params;
            const updateData = { ...value };

            if (req.body.name?.trim()) {
                req.body.name = req.body.name.trim();
                const isBranchExists = await branchRepo.getByField({
                    name: { $regex: `^${req.body.name}$`, $options: "i" },
                    _id: { $ne: id },
                    isDeleted: false
                });
             
                if (isBranchExists) {
                     res.status(200).json({ success: false, message:"Branch name is already exist"})
                     return;
                }
            }
        
            const updatedBranch = await branchRepo.updateById(id, updateData);

            if (updatedBranch && updatedBranch._id) {
                res.status(200).json({ success: true, message:"Branch data is updated successfully", data: updatedBranch})
                return
            } else {
                res.status(400).json({ success: false, message:"Something Went wrong"})
                return
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message})
        }
    }

    @Delete("/branch/:id")
    @ApiOperation("Delete a Branch data")
    @ApiResponse(200, "Branch Data Deleted successfully")
    @ApiResponse(404, "Branch Data not found")
    @ApiResponse(500, "Internal Server Error")
    // Delete a Branch by ID
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedUser = await branchRepo.updateById(id,{isDeleted:true})

            if (deletedUser) {
                res
                    .status(200)
                    .json({ success: true, message: "User deleted successfully" });
                    return
            } else {
                res.status(404).json({ success: false, message: "User not found" });
                return
            }
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
}
