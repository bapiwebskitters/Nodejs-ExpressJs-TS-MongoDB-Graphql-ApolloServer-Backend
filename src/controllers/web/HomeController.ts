import { Request, Response } from 'express';

export class HomeController {
    // Handle dashboard request
    public dashboard(req: Request, res: Response): void {
        console.log('dashboard');
        // Render the dashboard view with user data
        res.render('dashboard', { title: 'Admin dasboard',  user: req.user });
    }
}
