// src/controllers/BaseController.ts
import { Request, Response } from 'express';

export abstract class BaseController {
    protected sendSuccess(res: Response, data: any, message: string = 'Success') {
        res.status(200).json({
            status: 'success',
            message,
            data
        });
    }

    protected sendError(res: Response, message: string = 'Error', statusCode: number = 400) {
        res.status(statusCode).json({
            status: 'error',
            message
        });
    }

    // Abstract method to be implemented by subclasses
    abstract handleRequest(req: Request, res: Response): void;
}
