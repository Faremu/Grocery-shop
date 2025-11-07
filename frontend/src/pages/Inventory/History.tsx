import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useQuery } from "@tanstack/react-query";
import type { TransactionData, TransactionResponse } from "../../Types";

const fetchData = async (): Promise<TransactionData[]> => {
    const res = await axios.get<TransactionResponse[]>("http://localhost:3000/transaction");
    const data = res.data.map((item):TransactionData => ({
        ...item,
        timestamp: new Date(item.timestamp)
    }));
    return data;
};

const History = () => {
    const headers=   [{ key: "timestamp", label: "Timestamp" },
    { key: "type", label: "หมวดหมู่" },
    { key: "code", label: "รหัสสินค้า" },
    { key: "amount", label: "จำนวน" },
    { key: "receive", label: "รับเงินมา" },
    { key: "total", label: "รวมทั้งสิ้น" },
    { key: "change", label: "ทอน" },
    ];
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const {data=[],isLoading,isError,error} = useQuery({
        queryKey:["History"],
        queryFn:fetchData,
    })
    if(isLoading)return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;


    return (
        <div>
            <p>ประวัติการทำรายการ</p>
            <div className="w-full  flex flex-row justify-end mb-5 pr-10">
                <p>ตั้งแต่</p>
                <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date ?? undefined)}
                        selectsStart
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
                <p>ถึง</p>
                <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        minDate={startDate}
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
            </div>
            <div className="flex flex-row gap-2">
                <p>หมวดหมู่ :</p>
                <button className="bg-[#00C853] rounded-full text-center text-white w-[100px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#00C853]">เพิ่มสินค้าใหม่</button>
                <button className="bg-[#FF4D4D] rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#FF4D4D]">ลบสินค้า</button>
                <button className="bg-[#D9D9D9] rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#D9D9D9]">แก้ไขสินค้า</button>
                <button className="bg-yellow-400 rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-yellow-400">ขาย</button>
            </div>
            
            <table className="table-auto m-10 p-5 bg-white">
                <thead>
                    <tr>
                        {headers.map(h => (
                            <td key={h.key} className="border p-2 bg-white">
                                {h.label}
                            </td>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item=>{
                        
                        return (
                            <tr>
                                 {headers.map(h => {
                                    if (h.key === "type") {
                                    return (
                                        <td key={h.key} className="border border-gray-400 p-2">
                                        <div className="bg-yellow-400 rounded-full text-center text-white h-fit w-[80px]">
                                            {String(item[h.key as keyof typeof item])}
                                        </div>
                                        </td>
                                    );
                                    } else if (h.key === "change") {
                                    return (
                                        <td key={h.key} className="border border-gray-400 p-2">
                                        {item.receive - item.total}
                                        </td>
                                    );
                                    } else {
                                    const value = item[h.key as keyof typeof item];
                                    return (
                                        <td key={h.key} className="border border-gray-400 p-2">
                                        {value instanceof Date ? value.toLocaleString() : value}
                                        </td>
                                    );
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
        </div>
    )
}
export default History