import express from "express"
import authRoutes from './auth';
import boardsRoutes from './boards'; 
import tasksRoutes from './tasks'; 


const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/boards', boardsRoutes);
app.use('/api/v1/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});

export { app };