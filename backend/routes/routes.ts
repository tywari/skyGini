import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const readJson = (filename: string) => {
    const filePath = path.join(__dirname, `../data/${filename}`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
};

router.get('/customer-type', (req, res) => {
    res.json(readJson('customer_type.json'));
});

router.get('/account-industry', (req, res) => {
    res.json(readJson('account_industry.json'));
});

router.get('/team', (req, res) => {
    res.json(readJson('team.json'));
});

router.get('/acv-range', (req, res) => {
    res.json(readJson('acv_range.json'));
});

export default router;
