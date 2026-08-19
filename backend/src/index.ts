import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Microservicio de autenticacion corriendo en puerto ${PORT}`);
});

export default app;
