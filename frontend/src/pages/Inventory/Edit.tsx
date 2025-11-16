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
    const [addShow, setAddShow] = useState<boolean>(false)
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
            <div className="flex flex-row">
                
                <table className="table-auto bg-white mr-10">
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
                                    else if(idx === 5){
                                        return (
                                        <td key={`${item.code}-${header[idx-1]}`} className="border border-gray-400 p-2">
                                            <div className="flex flex-row justify-center items-center">
                                                <p className="pr-3">{values[idx-1]}</p>
                                                <div className="flex flex-col">
                                                    <button className="p-0 hover:cursor-pointer">
                                                        <svg className="w-5 h-5 fill-current text-gray-400 hover:text-green-600 transition-colors duration-200 active:translate-y-0.5" viewBox="0 0 1024 412" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M512.03799 0 921.675981 411.648 102.4 411.648 512.03799 0Z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-0 hover:cursor-pointer -mt-1">
                                                        <svg className="w-5 h-5 fill-current text-gray-400 hover:text-red-600 transition-colors duration-200 active:-translate-y-0.5" viewBox="0 584 1024 412" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M512.03799 995.328 102.4 583.68 921.675981 583.68 512.03799 995.328Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        )
                                    }
                                    else if(idx === 7){
                                        return (
                                            <td className="border border-gray-400 p-2 space-x-2 ">
                                                <div className="relative inline-block group">
                                                    {/* Hover target */}
                                                    <div className="border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200">
                                                        เพิ่ม
                                                    </div>

                                                    {/* Hidden div */}
                                                    <div className="absolute top-full left-0 mt-2 flex flex-row bg-white rounded-full shadow-xl py-1 px-3 space-x-2
                                                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button className="w-10 h-10 rounded-full hover:bg-gray-200">+3</button>
                                                        <button className="w-10 h-10 rounded-full hover:bg-gray-200">+6</button>
                                                        <button className="w-10 h-10 rounded-full hover:bg-gray-200">+9</button>
                                                        <button className="w-10 h-10 rounded-full hover:bg-gray-200">+12</button>
                                                    </div>
                                                </div>


                                                
                                                <button className="border rounded-lg hover:cursor-pointer">แก้ไข</button>
                                                <button className="border rounded-lg hover:cursor-pointer">ลบ</button>
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

                <div>some chart here..</div>

            </div>
            
            
        </div>
    )
}
export default Edit