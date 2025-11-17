import type { MyDataItem } from "../../Types"
import axios from "axios"
import AddModal from "../../components/modals/Add";
import {  useEffect, useState } from "react";

type DeleteResponse = {
  success: boolean;
  message: string;
};

const Edit = () => {
    const header = ["รูปภาพ","รหัส","ชื่อ", "ราคา", "ต้นทุน","คงเหลือ", "ขายได้" ,"จัดการ"]
    const [showModal,setShowModal] = useState<boolean>(false);
    const [activeRow, setActiveRow] = useState<string | null>(null)
    const [merchandise, setMerchandise] = useState<MyDataItem[] | null>(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get<MyDataItem[]>("http://localhost:3000/merlist");
            setMerchandise(res.data);
        } catch (err) {
            console.error(err);
            setMerchandise([]);
            }
        };
        fetchData();
    }, []);
    const batchAdd = async(code:string,amount:number) => {
        try{
        const res = await axios.put("http://localhost:3000/addbatch",{code,amount});
        console.log(res.data);
        setMerchandise(prev =>
            prev
                ? prev.map(item =>
                    item.code === code
                    ? { ...item, stock: item.stock + amount } // increment stock
                    : item
                )
                : []
            );
        } catch (err) {
            console.error(err);
            alert("เพิ่มสินค้าไม่สำเร็จ");
        }
    }
    // In render:
    if (merchandise === null) return <div>Loading...</div>;
    const closeModal = () =>{
        setShowModal(false)
    }
    const handleDelete = async (code: string,amount:number) => {
        if (!confirm("ต้องการลบสินค้านี้ใช่หรือไม่")) return;

        try {
        const res = await axios.post<DeleteResponse>(
            "http://localhost:3000/deletemer",
            { code,amount },
            { headers: { "Content-Type": "application/json" } }
        );
        
        if (res.data.success) {
            setMerchandise(prev => prev ? prev.filter(item => item.code !== code) : []);
        } else {
            alert("ลบไม่สำเร็จ: " + res.data.message);
        }
        } catch (err) {
            console.error(err);
        }
    };
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
                        {merchandise.map(item=>{
                            return (
                            <tr key={item.code}>
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
                                            <td key={`${item.code}-manage`} className="border border-gray-400 p-2 space-x-2 ">
                                                <div className="flex flex-row justify-center">
                                                    <div
                                                    className="relative inline-block"
                                                    onMouseEnter={() => setActiveRow(item.code)}
                                                    onMouseLeave={() => setActiveRow(prev => prev === item.code ? null : prev)}
                                                    >
                                                        <div className="rounded-lg p-1 cursor-pointer hover:bg-gray-200" title="เพิ่มสินค้า">
                                                            <img src="./img/add.png" className="h-5 w-5" alt="" />
                                                        </div>
                                                        <div
                                                            className={`text-white z-10 absolute -left-23 flex flex-row bg-green-400 rounded-full shadow-lg py-1 px-3 space-x-2 duration-150
                                                            ${activeRow === item.code ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                                                        >
                                                            <button className="w-10 h-10 rounded-full hover:scale-125 active:scale-100 hover:cursor-pointer" onClick={()=>batchAdd(item.code,3)}>+3</button>
                                                            <button className="w-10 h-10 rounded-full hover:scale-125 active:scale-100 hover:cursor-pointer" onClick={()=>batchAdd(item.code,6)}>+6</button>
                                                            <button className="w-10 h-10 rounded-full hover:scale-125 active:scale-100 hover:cursor-pointer" onClick={()=>batchAdd(item.code,9)}>+9</button>
                                                            <button className="w-10 h-10 rounded-full hover:scale-125 active:scale-100 hover:cursor-pointer" onClick={()=>batchAdd(item.code,12)}>+12</button>
                                                        </div>
                                                    </div>



                                                    
                                                    <div className="p-1 rounded-lg cursor-pointer hover:bg-gray-200" title="แก้ไขสินค้า">
                                                        <img src="./img/edit1.png" className="h-5 w-5" alt="" />
                                                    </div>
                                                    <div className="p-1 rounded-lg cursor-pointer hover:bg-gray-200" title="ลบสินค้า" 
                                                    onClick={()=>handleDelete(item.code,item.stock)}>
                                                        <img src="./img/bin.png" className="h-5 w-5" alt="" />
                                                    </div>
                                                </div>
                                                
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