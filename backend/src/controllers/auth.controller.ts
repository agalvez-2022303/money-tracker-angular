import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.middleware';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const users: User[] = [
  { id: '1', email: 'admin@moneytracker.com', password: 'admin123', name: 'Administrador' },
  { id: '2', email: 'demo@moneytracker.com', password: 'demo123', name: 'Usuario Demo' }
];

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email y password son requeridos' });
    return;
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ error: 'Credenciales invalidas' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '2m' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

export const verifyToken = (req: Request, res: Response): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ valid: false, error: 'Token requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token invalido o expirado' });
  }
};

export const getProfile = (req: Request, res: Response): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    res.status(401).json({ error: 'Token invalido o expirado' });
  }
};
