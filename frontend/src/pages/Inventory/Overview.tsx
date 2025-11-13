import { useState  } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { useQuery } from '@tanstack/react-query';
import Chart from "../../components/Chart"
import Top from '../../components/Top';
import axios from 'axios';

const fetchData = async () => {
    const res = await axios.get("http://localhost:3000/inventory");
    return res.data;
}

const Overview = () => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const {data=[], isLoading,isError, error} = useQuery({
        queryKey: ["overview"],
        queryFn: fetchData,

    });
    
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;
    
    return (
        <div>
            <div className="w-full  flex flex-row justify-end mb-5 pr-10">
                <p>ตั้งแต่</p>
                <DatePicker
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        selectsStart
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
                <p>ถึง</p>
                <DatePicker
                        selected={endDate}
                        onChange={(date) => date && setEndDate(date)}
                        selectsEnd
                        minDate={startDate}
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
            </div>
            <Chart startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
            <div className='flex flex-row'>
                <div>
                    <div className='bg-white shadow-lg w-100 h-20 my-10 mr-10 rounded-2xl p-5 flex flex-row items-center justify-between hover:ring-1 duration-700 cursor-pointer'>
                        <div className='mr-10 text-green-600'>
                            <p>รายรับรวม</p>
                            <p>(บาท)</p>
                        </div>
                        <div>
                            <p className='text-4xl'>{data.income.toLocaleString('en-US',{minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                    <div className='bg-white shadow-lg w-100 h-20 my-10 mr-10 rounded-2xl p-5 flex flex-row items-center justify-between hover:ring-1 duration-700 cursor-pointer'>
                        <div className='mr-10 text-red-600'>
                            <p>รายจ่ายรวม</p>
                            <p>(บาท)</p>
                        </div>
                        <div>
                            <p className='text-4xl'>{data.expense.toLocaleString('en-US',{minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                    <div className='bg-white shadow-lg w-100 h-20 my-10 mr-10 rounded-2xl p-5 flex flex-row items-center justify-between hover:ring-1 duration-700 cursor-pointer'>
                        <div className='mr-10 text-blue-600'>
                            <p>กำไรสุทธิ</p>
                            <p>(บาท)</p>
                        </div>
                        <div>
                            <p className='text-4xl'>{data.profit.toLocaleString('en-US',{minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                </div>
                <Top/>
                
            </div>
                
            
        </div>
    )
}

export default Overview