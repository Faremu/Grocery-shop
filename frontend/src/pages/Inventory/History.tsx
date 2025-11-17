import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useQuery } from "@tanstack/react-query";
import type { TransactionData, TransactionResponse } from "../../Types";

const fetchData = async (startDate: Date, endDate: Date): Promise<TransactionData[]> => {
    const startStr = startDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const endStr = endDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const res = await axios.get<TransactionResponse[]>(`http://localhost:3000/transaction?startdate=${startStr}&enddate=${endStr}`);
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
    const [selectedType, setSelectedType] = useState<string>("");
    const {data=[],isLoading,isError,error} = useQuery({
        queryKey:["History", startDate, endDate],
        queryFn:() =>fetchData(startDate!, endDate!),
    })
    const filtered = data.filter(item => 
        selectedType === "" || item.type === selectedType
    );
    if(isLoading)return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;


    return (
        <div>
            <p>ประวัติการทำรายการ</p>
            <div className="w-full  flex flex-row justify-end mb-5 pr-10">
                <p>ตั้งแต่</p>
                <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date ?? new Date())}
                        selectsStart
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
                <p>ถึง</p>
                <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date ?? new Date())}
                        selectsEnd
                        minDate={startDate}
                        className="text-center border-b-2 mx-2 w-[120px]"
                        showYearDropdown
                        showMonthDropdown
                        />
            </div>
            <div className="flex flex-row gap-2">
                <p>หมวดหมู่ :</p>
                <button className="bg-[#00C853] rounded-full text-center text-white w-[100px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#00C853]" onClick={()=>setSelectedType("เพิ่มสินค้าใหม่")}>เพิ่มสินค้าใหม่</button>
                <button className="bg-[#668cff] rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#668cff]" onClick={()=>setSelectedType("เพิ่มสินค้า")}>เพิ่มสินค้า</button>
                <button className="bg-[#FF4D4D] rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#FF4D4D]" onClick={()=>setSelectedType("ลบสินค้า")}>ลบสินค้า</button>
                <button className="bg-[#D9D9D9] rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#D9D9D9]" onClick={()=>setSelectedType("แก้ไขสินค้า")}>แก้ไขสินค้า</button>
                <button className="bg-yellow-400 rounded-full text-center text-white w-[80px] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-yellow-400" onClick={()=>setSelectedType("ขาย")}>ขาย</button>
                <button className="hover:cursor-pointer" onClick={()=>setSelectedType("")}><u>รีเซ็ต</u></button>
            </div>
            <div className="overflow-y-auto max-h-[calc(10*2.5rem)] m-10 w-170">
            <table className="w-160 table-auto p-5 bg-white mt-1">
                <thead className="bg-white sticky top-0 z-10">
                    <tr>
                        {headers.map(h => (
                            <td key={h.key} className="border-2 p-2 bg-white">
                                {h.label}
                            </td>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.length > 0 ? (
                        filtered.map((item, index) => (
                        <tr key={index}>
                            {headers.map(h => {
                            if (h.key === "type") {
                                let color = ""
                                const type_prop = String(item[h.key as keyof typeof item]);
                                if(type_prop === "ขาย"){
                                    color = "bg-yellow-400 w-[80px]"
                                }else if(type_prop === "เพิ่มสินค้าใหม่"){
                                    color = "bg-[#00C853] w-[100px]";
                                }else if(type_prop === "ลบสินค้า"){
                                    color = "bg-[#FF4D4D] w-[80px]";
                                }else if(type_prop === "แก้ไขสินค้า"){
                                    color = "bg-[#D9D9D9] w-[80px]";
                                }else if(type_prop === "เพิ่มสินค้า"){
                                    color = "bg-[#668cff] w-[80px]";
                                }
                                return (
                                <td key={h.key} className="border border-gray-400 p-2">
                                    <div className="flex justify-center">
                                        <div className={`${color} rounded-full text-center text-white h-fit `}>
                                            {type_prop}
                                        </div>
                                    </div>
                                </td>
                                );
                            } else if (h.key === "change") {
                                if(item.receive == null || item.total == null)return(
                                  <td key={h.key} className="border border-gray-400 p-2">-</td>  
                                );
                                return (
                                <td key={h.key} className="border border-gray-400 p-2">
                                    {item.receive - item.total}
                                </td>
                                );
                            } else {
                                let value = item[h.key as keyof typeof item];
                                if(value == null)value = "-";
                                return (
                                <td key={h.key} className="border border-gray-400 p-2">
                                    {value instanceof Date ? value.toLocaleString() : value}
                                </td>
                                );
                            }
                            })}
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td
                            colSpan={headers.length}
                            className="border p-2 text-center text-gray-500"
                        >
                            - ยังไม่มีรายการใด -
                        </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    )
}
export default History