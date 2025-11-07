import { useQuery } from "@tanstack/react-query";
import type { MyDataItem } from "../../Types"
import axios from "axios"
import AddModal from "../../components/modals/Add";
import { useState } from "react";

const fetchData = async():Promise<MyDataItem[]> => {
    const res = await axios.get("http://localhost:3000/merlist");
    return res.data;
}

const Edit = () => {
    const header = ["รูปภาพ","รหัส","ชื่อ", "ราคา", "ต้นทุน","คงเหลือ", "ขายได้" ,"จัดการ"]
    const [showModal,setShowModal] = useState<boolean>(false);
    const {data=[], isLoading, isError, error} = useQuery({
        queryKey: ["Edit"],
        queryFn: fetchData,
    })

    if(isLoading)return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;

    const closeModal = () =>{
        setShowModal(false)
    }
    return (
        <div>
            {showModal && <AddModal onClose={closeModal}/>}
            <p className="my-2">แก้ไขสินค้า</p>
            <button onClick={()=>setShowModal(true)} className="my-2 p-2 bg-[#eef2ff] text-[#4f39f6] rounded-lg ring hover:bg-[#d5dfff] cursor-pointer">เพิ่มสินค้าใหม่</button>
            <table className="table-auto bg-white">
                <thead>
                    <tr>
                        {header.map(item=><th key={item} className="p-2 text-left border border-gray-400">{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item=>{
                        return (
                        <tr>
                            {header.map((_,idx)=>{
                                const values = Object.values(item);
                                if(idx === 0){
                                    return (<td className="border border-gray-400">
                                                <img className="h-20 w-20 object-cover" src={`http://localhost:3000/uploads/img/${item.code}.jpg`} alt="" />
                                            </td>);
                                }
                                else if(idx === 7){
                                    return (
                                        <td className="border border-gray-400 p-2 space-x-2">
                                            <button className="border rounded-lg">เพิ่ม</button>
                                            <button className="border rounded-lg">แก้ไข</button>
                                            <button className="border rounded-lg">ลบ</button>
                                        </td>
                                    )
                                }

                                
                                return (
                                    <td key={`${item.code}-${header[idx-1]}`} className="border border-gray-400 p-2">{values[idx-1]}</td>
                                )
                            })}
                        </tr> 
                        )
                    })}
                    </tbody>
                
            </table>
        </div>
    )
}
export default Edit