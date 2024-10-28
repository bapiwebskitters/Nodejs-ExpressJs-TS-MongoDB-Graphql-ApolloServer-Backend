import { Request, Response } from "express";
import { clientUpdateSchema, clientCreateSchema } from "../../../validations/client.validation";
import { UserRepository } from "../../../repository/UserRepository";
import Role from "../../../models/Role";
import mongoose from "mongoose";
import { BrachRepository } from "../../../repository/branchRepository";

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

const clientRepo = new UserRepository();
const branchRepo = new BrachRepository()

@ApiTags("Client")
export default class ClientController {
    @Get("/client")
    @ApiOperation("Get Client")
    @ApiResponse(200, "List of Client retrieved successfully")
    @ApiResponse(400, "Bad Requiest")
    @ApiResponse(500, "Internal Server Error")
    public async index(req: Request, res: Response): Promise<void> {
        try {
            const result = await clientRepo.getAllClient(req.body);
            res.status(200).json({ success: true, message: "View Client List", data: result })
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ success: false, message: err.message })
        }
    }



    @Post("/client/create")
    @ApiOperation("Insert a service")
    @ApiBody({ type: "object", properties: {
        email: { type: 'string' },
        new_password: { type: 'string' },
        confirm_password: { type: 'string',  },
        full_name: { type: 'string'},
        branch_id: { type: 'string', },
        phone: { type: 'string', },
        contact_person: { type: 'string'},
        contact_person_phone: { type: 'string'},
        house_no: { type: 'string' },
        address: { type: 'string'},
        city: { type: 'string'},
        zipcode: { type: 'string' },
        state: { type: 'string' },
        landmark: { type: 'string' },
        profile_image:{type:'string'},
        first_name:{type:'string'},
        last_name:{type:'string'},
        username:{type:'string'}
      } })
    @ApiResponse(200, "Client data Inserted successfully")
    @ApiResponse(400, "Bad Request")
    @ApiResponse(500, "Internal Server Error")
    public async store(req: Request, res: Response): Promise<void> {

        const { error, value } = clientCreateSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error.details })
            return;
        }
    
        try {

            const { full_name, email, phone, branch_id } = value;

            if (req.body.new_password !== req.body.confirm_password) {
                res.status(400).json({ success: false, message: "New Password and Confirm Password should be same" })
                return;
            }

            req.body.password = req.body.confirm_password

            const checkBranch = await branchRepo.getById(branch_id)
            if (!checkBranch) {
                res.status(400).json({ success: false, message: "This branch id is not exist" })
                return;
            }


            let roleDetails = await Role.findOne({ role: 'client' });
            if (roleDetails) {
                req.body.role = roleDetails._id;
            }

            if (email) {
                req.body.email = req.body.email.trim().toLowerCase()
                let checkEmail = await clientRepo.getByField({ isDeleted: false, email: req.body.email, role: req.body.role });
                if (checkEmail) {
                    res.status(400).json({ success: false, message: "This client's email id is already exist" })
                    return;
                };
            }

            if (phone) {
                req.body.phone = req.body.phone.trim()
                let checkPhone = await clientRepo.getByField({ isDeleted: false, phone: req.body.phone, role: req.body.role });
                if (checkPhone) {
                    res.status(400).json({ success: false, message: "This client's phone number is already exist" })
                    return;
                };
            }

            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((file: any) => {
                    if (file.fieldname === 'profile_image') {
                        req.body.profile_image = file.filename;
                    }
                });
            }

            let userAdd = await clientRepo.save(req.body);
            
            if ((userAdd) && userAdd._id) {
                let clientData = await clientRepo.getUserDetails(req.body);
                res.status(201).json({ success: true, message: "Client data Added Successfully", data: userAdd })
                return;
            } else {
                res.status(400).json({ success: false, message: "Sorry, Client data is not Added" })
                return
            }

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message })
        }
    }


    @Get("/client/:id")
    @ApiOperation("Get Client Particular data")
    @ApiResponse(200, "Client Data Fetch successfully")
    @ApiResponse(404, "Client Data not found")
    @ApiResponse(500, "Internal Server Error")
    public async show(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                res.status(400).json({ success: false, message: "Branch id is not valid" })
                return;
            }

            const clientData = await clientRepo.getUserDetails({ _id: new mongoose.Types.ObjectId(id), isDeleted: false })

            if (clientData) {
                res.status(200).json({ success: true, message: "Client data Fetch sucessfully", data: clientData })
                return
            } else {
                res.status(400).json({ success: false, message: "Something went wrong" })
                return;
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message })
        }
    }


    @Put("/client/:id")
    @ApiOperation("Update a Client data")
    @ApiBody({ type: "object", properties: {
        email: { type: 'string' },
        new_password: { type: 'string' },
        confirm_password: { type: 'string',  },
        full_name: { type: 'string'},
        branch_id: { type: 'string', },
        phone: { type: 'string', },
        contact_person: { type: 'string'},
        contact_person_phone: { type: 'string'},
        house_no: { type: 'string' },
        address: { type: 'string'},
        city: { type: 'string'},
        zipcode: { type: 'string' },
        state: { type: 'string' },
        landmark: { type: 'string' },
        profile_image:{ type:'string'},
        first_name:{type:'string'},
        last_name:{type:'string'}
      } })
    @ApiResponse(200, "Client Data updated successfully")
    @ApiResponse(404, "Client Data not found")
    @ApiResponse(500, "Internal Server Error")
    public async update(req: Request, res: Response): Promise<void> {
        const { error, value } = clientUpdateSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error.details[0].message });
            return;
        }

        try {
            const { full_name, email, new_password, confirm_password } = value;
            const clientId = req.params.id; // Assuming the ID is passed as a URL parameter

            // Ensure passwords match if they are provided

            if (new_password && confirm_password) {
                if (new_password || confirm_password) {
                    if (new_password !== confirm_password) {
                        res.status(400).json({ success: false, message: "New Password and Confirm Password should be the same" });
                        return;
                    }
                }
            }


            // Find the existing user record
            const existingUser = await clientRepo.getById(clientId);
            if (!existingUser) {
                res.status(404).json({ success: false, message: "Client not found" });
                return;
            }

            // Update the email if provided and check for existing email
            if (req.body.email) {
                const trimmedEmail = email.trim().toLowerCase();
                const emailExists = await clientRepo.getByField({ isDeleted: false, email: trimmedEmail, _id: { $ne: clientId } });
                if (emailExists) {
                    res.status(400).json({ success: false, message: "This email is already in client by another client" });
                    return;
                }
                req.body.email = trimmedEmail;
            }

            // Handle file uploads if any
            // if (req.files && Array.isArray(req.files)) {
            //     req.files.forEach((file: any) => {
            //         if (file.fieldname === 'profile_image') {
            //             req.body.profile_image = file.filename;
            //         }
            //     });
            // }

            // Update the Client record
            const updatedUser = await clientRepo.updateById(clientId, req.body);
            if (updatedUser) {
                const clientData = await clientRepo.getUserDetails({ _id: updatedUser._id });
                res.status(200).json({ success: true, message: "Client data updated successfully", data: clientData });
                return;
            } else {
                res.status(400).json({ success: false, message: "Sorry, client data could not be updated" });
                return;
            }

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message });
        }
    }


    @Put("/client/status/:id")
    @ApiOperation("Update Client Status")
    @ApiResponse(200, "Client status updated successfully")
    @ApiResponse(404, "Client not found")
    @ApiResponse(500, "Internal Server Error")
    public async statusUpdate(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                res.status(400).send({ success: true, message: "Client Id is not valid" })
                return
            }

            let clientData = await clientRepo.getById(id);
            if (clientData) {
                const newStatus: "Active" | "Inactive" = clientData.status === "Active" ? "Inactive" : "Active";
                const updatedData = await clientRepo.updateById(id, { status: newStatus });

                if ((updatedData) && (updatedData._id)) {
                    res.status(200).send({ success: true, message: "Branch updated successfully", data: updatedData })
                    return
                } else {
                    res.status(400).send({ success: true, message: "Something went Wrong" })
                    return
                }

            } else {
                res.status(400).send({ success: true, message: "Client data is not found" })
                return
            }

        } catch (error) {
            const err = error as Error;
            res.status(500).json({ success: false, message: err.message });
        }
    }

    @Delete("/client/:id")
    @ApiOperation("Deleted client Data")
    @ApiResponse(200, "Client data Deleted successfully")
    @ApiResponse(404, "Client not found")
    @ApiResponse(500, "Internal Server Error")
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedUser = await clientRepo.updateById(id, { isDeleted: true })

            if (deletedUser) {
                res
                    .status(200)
                    .json({ success: true, message: "Client deleted successfully" });
                return
            } else {
                res.status(404).json({ success: false, message: "Client not found" });
                return
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
}
