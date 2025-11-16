import { useQuery } from "@tanstack/react-query";
import axios from "axios"
import type { Account } from "../Types";
const fetchData = async():Promise<Account[]> => {
    const res = await axios.get("http://localhost:3000/account");
    return res.data;

}
const DebtPage = () => {
    const {data=[],isLoading,isError,error} = useQuery<Account[]>({
        queryKey:["Account"],
        queryFn:fetchData
    })
    if(isLoading)return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;
    return (
        <div className="bg-white rounded-4xl p-10">
            <p className="text-2xl mb-10">รายชื่อ</p>
            <div className="p-10 grid grid-cols-5 gap-4">
                {data.map((item,idx)=>{
                    return (
                        <div key={`person-${idx}`} className="flex shadow-md justify-center items-center w-30 h-30 rounded-full bg-white" >{item.name}</div>
                    )
                })}
                <div>
                    <button className="w-30 h-30 rounded-xl bg-white ring hover:cursor-pointer active:translate-y-1">เพิ่ม</button>
                </div>
            </div>
        </div>
    )
} 

export default DebtPage