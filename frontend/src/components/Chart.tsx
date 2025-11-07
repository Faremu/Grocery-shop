import {LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Label, Tooltip} from 'recharts'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
interface Transaction {
  timestamp: string | number | Date; // depending on your source
  receive: number;
  total: number; // or cost if you have it
}
type chartProps = {
    startDate: Date,
    endDate:Date
}
const fetchData = async() =>{
    const res = await axios.get("http://localhost:3000/transaction");
    return res.data;
}

const Chart = ({startDate,endDate}:chartProps) => {

    const {data=[], isLoading, isError, error} = useQuery({
        queryKey:["Transaction"],
        queryFn:fetchData
    });
    if(isLoading)return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;
    console.log(data);
    
    // Group by month
    const grouped: Record<string, { income: number; expense: number; profit: number }> = {};
    const start = new Date(startDate!);
    const end = new Date(endDate!);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const groupByDay = diffDays < 30;
    
    const fullLabels: string[] = [];

    if (groupByDay) {
        const current = new Date(start);
        while (current <= end) {
            fullLabels.push(format(current, "yyyy-MM-dd"));
            current.setDate(current.getDate() + 1);
        }
    } else {
        // monthly range
        const current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
            fullLabels.push(format(current, "yyyy-MM"));
            current.setMonth(current.getMonth() + 1);
        }
    }
    // Initialize all dates/months with 0
    fullLabels.forEach((label) => {
        grouped[label] = { income: 0, expense: 0, profit: 0 };
    });

    // Add actual data
    data.forEach((tx: Transaction) => {
        const txDate = new Date(tx.timestamp);
        if (txDate >= start && txDate <= end) {
            const key = groupByDay ? format(txDate, "yyyy-MM-dd") : format(txDate, "yyyy-MM");
            grouped[key].income += tx.receive;
            grouped[key].expense += tx.total;
            grouped[key].profit = grouped[key].income - grouped[key].expense;
        }
    });
    const chartData = fullLabels.map((label) => ({
        name: label,
        ...grouped[label],
    }));
    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} className='shadow-lg' style={{ background: "#fff", borderRadius: 8, padding: "10px" }} margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}         // rotate labels to prevent overlap
                        textAnchor="end"
                        interval={0}        // show all labels
                        tickFormatter={(date) => format(new Date(date), "d MMM", { locale: th })}
                        >
                        <Label
                            value={groupByDay ? "วัน" : "เดือน"}
                            offset={40}
                            position="insideBottom"
                        />
                    </XAxis>
                    <YAxis>
                        <Label value="บาท (฿)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip
                        // Format the values as Thai currency
                        formatter={(value: number, name: string) => {
                            const thaiLegend: Record<string, string> = { income: "รายรับ", expense: "รายจ่าย", profit: "กำไร" };
                            return [value.toLocaleString("th-TH", { style: "currency", currency: "THB" }), thaiLegend[name] || name];
                        }}
                        // Optional: format the label (the X-axis value) if you want
                        labelFormatter={(label) => `เดือน: ${label}`}
                    />
                    <Legend verticalAlign="top" formatter={(value) => {
                    const thaiLegend: Record<string, string> = { income: "รายรับ", expense: "รายจ่าย", profit: "กำไร" };
                    return thaiLegend[value] || value;
                    }} />
                    <Line type="monotone" dataKey="income" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="expense" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" stroke="#ff7300" />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default Chart