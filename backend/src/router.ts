import express, {NextFunction, Request,Response} from 'express'
import { db } from './db';
import { error, log, time } from 'console';
import multer from 'multer';
import path from 'path';
import { DateTime } from 'luxon';
import { RowDataPacket } from 'mysql2';

interface CustomRequest extends Request {
  fullCode?: string;
}
interface InventoryRow extends RowDataPacket {
  sold: number;
  price: number;
  cost: number;
}
interface TransactionQuery {
  startdate?: string;
  enddate?: string;
}
interface Merchandise {
  code: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  sold: number;
  amount: number;
  receive: number;
}
interface SellBody {
  cart: Merchandise[];
  total: number;
  receive: number;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/img'); // your upload folder
  },
  filename: (req, file, cb) => {
    // Extract file extension
    const code = req.body.code;
    const ext = path.extname(file.originalname);
    const newName = `${code}${ext}`;

    cb(null, newName);
  }
});

const upload = multer({ storage });
const router = express.Router();


router.get('/',(req,res)=>{
    res.json("1000");
});
router.get('/inventory',async(req,res)=>{
  try {
    const [rows] = await db.query<InventoryRow[]>(`SELECT sold, price, cost FROM merchandise;`);
    const totals = rows.reduce(
      (acc, item) => {
        const revenue = item.sold * item.price;
        const profit = item.sold * (item.price - item.cost);
        const expense = item.sold * item.cost;


        acc.revenue += revenue;
        acc.profit += profit;
        acc.expense += expense;

        return acc;
      },
      { revenue: 0, profit: 0 , expense:0}
    );
    const dat = {
        profit:totals.profit,
        income:totals.revenue,
        expense:totals.expense
    } 
    res.json(dat);
  } catch (error) {
    console.error(error);
    
  }
    
});
router.get('/top', async(req,res)=>{
    try{
        const [row] = await db.query("SELECT * FROM merchandise");
        res.json(row);
    }
    catch{
        res.status(500).json({error:"Database error", details: error})

    }
});
router.get('/merlist', async(req,res)=>{
    try{
        const [row] = await db.query("SELECT * FROM merchandise;");
        res.json(row);
    }
    catch(error){
        res.status(500).json({error:"Database error", details: error})

    }
});
router.get('/transaction', async(req: Request<{}, {}, {}, TransactionQuery>,res: Response)=>{
  try {
    const { startdate, enddate } = req.query;
    if (!startdate || !enddate) {
      res.status(400).json({ error: "startdate and enddate are required" });
      return;
    }

    const start: string = startdate;
    const end: string = enddate;

    // Use DATE(timestamp) to ignore time, safe for inclusive date filter
    const query = `
      SELECT * 
      FROM transaction
      WHERE DATE(timestamp) BETWEEN ? AND ?
      ORDER BY timestamp;
    `;

    const [rows] = await db.query(query, [start, end]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error });
  }
});

router.post('/addmer',upload.single('image'),async (req: CustomRequest, res: Response) => {
    try {
      const baseCode = req.body.code;
      const [rows] = await db.query(
        `SELECT MAX(CAST(SUBSTRING(code, LENGTH(?) + 1) AS UNSIGNED)) AS maxNumber
         FROM merchandise
         WHERE code LIKE ?`,
        [baseCode, `${baseCode}%`]
      );
      const maxNumber = (rows as any)[0].maxNumber || 0;
      const fullCode = `${baseCode}${(maxNumber + 1).toString().padStart(3, '0')}`;

      if (req.file) {
        const fs = await import('fs');
        const ext = path.extname(req.file.originalname);
        const newPath = path.join(req.file.destination, `${fullCode}${ext}`);
        fs.renameSync(req.file.path, newPath);
      }

      // Save to DB
      const { name, price, cost, stock } = req.body;
      await db.query(
        `INSERT INTO merchandise (code, name, price, cost, stock) VALUES (?, ?, ?, ?, ?)`,
        [fullCode, name, price, cost, stock]
      );

      res.json({ message: 'Merchandise added', fullCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
);

router.post('/sell',async(req:Request<{}, {}, SellBody>,res:Response)=>{
  const ts = DateTime.now().toISO();
  const {cart,total,receive} = req.body;
  console.log(cart);
  
  const codes = cart.map(item => `'${item.code}'`).join(', ');
  const stockCases = cart
    .map(item => `WHEN '${item.code}' THEN stock - ${item.amount}`)
    .join(' ');
  const soldCases = cart
      .map(item => `WHEN '${item.code}' THEN sold + ${item.amount}`)
      .join(" ");
  const updateQuery = `
        UPDATE merchandise
        SET
          stock = CASE code
            ${stockCases}
            ELSE stock
          END,
          sold = CASE code
            ${soldCases}
            ELSE sold
          END
        WHERE code IN (${codes});
      `;
  try {
    await db.query(updateQuery);
    const transactionQuery = `
      INSERT INTO transaction (timestamp, type, code, amount, total, receive)
      VALUES ?
    `;
    const transactionValues = cart.map(item => [
      ts,
      "ขาย",
      item.code,
      item.amount,
      total,
      receive,
    ]);
    await db.query(transactionQuery, [transactionValues]);

    res.json({ message: 'Updated database successfully.'});
  } catch (error) {
    res.status(500).json({error:"Database error", details:error})
  }
  
  
})

router.get('/Beer',(req,res)=>{
    res.json("1000");
});



export default router