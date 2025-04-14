import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/routes';

const app = express();
app.use(cors());

app.use('/api', dataRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
