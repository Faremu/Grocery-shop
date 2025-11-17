import axios from "axios";
import { useState } from "react";

type BoolTypeProps={
    onClose: ()=>void;
}

const AddModal = ({onClose}:BoolTypeProps) =>{
    const [amount, setAmount] = useState(1);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const buttons = [
        { label: "ขนม", value: "SN" },
        { label: "เครื่องดื่ม", value: "BV" },
        { label: "สิ่งเสพติด", value: "AL" },
    ];
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        if (!e.target.files || e.target.files.length === 0) return;
        const img = e.target.files[0];
        setImageFile(img);
        setPreview(URL.createObjectURL(img));

    }
    const addMerchandise = async() => {
        if (!name || !code || !cost || !price || !amount || !imageFile) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        const formData = new FormData();
        formData.append("code", code);
        formData.append("name", name);
        formData.append("cost", cost.toString());
        formData.append("price", price.toString());
        formData.append("stock", amount.toString());
        if (imageFile) formData.append("image", imageFile);
        try{
            const res = await axios.post("http://localhost:3000/addmer",formData, {
                headers: { "Content-Type": "multipart/form-data" },});
            console.log(res.data);
            window.location.reload();
        }catch(err){
            console.error(err);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white h-140 w-100 rounded-xl flex flex-col items-center justify-center space-y-2" onClick={(e) => e.stopPropagation()}>
                <p className="text-2xl">รายละเอียดสินค้า</p>
                <p className="">เพิ่มรูปภาพ</p>
                <label htmlFor="file-upload" className="mb-5 relative ring">
                    <img src={preview || "/img/Placeholde.png"} className="w-[130px] h-[130px] cursor-pointer object-cover" alt="" />
                </label>
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleChange}/>
                <div className="flex flex-row">
                    <p className="flex w-25 text-left items-center">ประเภทสินค้า:</p>
                    <div className="flex">
                        {buttons.map((btn,idx) => (
                            <button
                            key={btn.value}
                            onClick={() => setCode(btn.value)}
                            className={` cursor-pointer px-2 py-1 transition-colors
                                ${code === btn.value ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}
                                ${idx=== 0 ? "rounded-l-full" : idx === buttons.length - 1 ? "rounded-r-full" : ""}
                            `}
                            >
                            {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row">
                    <p className="w-25 text-left">ชื่อสินค้า:</p>
                    <input className="px-1 border-b border-black w-40 focus:outline-none" type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="flex flex-row">
                    <p className="w-25 text-left">ต้นทุน (บาท):</p>
                    <input className="px-1 border-b border-black w-40 text-center focus:outline-none" type="text" value={cost} onChange={(e)=>setCost(Number(e.target.value))} />
                </div>
                <div className="flex flex-row">
                    <p className="w-25 text-left">ราคา (บาท):</p>
                    <input className="px-1 border-b border-black w-40 text-center focus:outline-none" type="text" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
                </div>
                
                <p className="m-2">จำนวน</p>
                <div className="flex flex-row items-center">
                    <button className="h-10 w-10 mx-2 mb-2 rounded-full cursor-pointer text-3xl text-gray-300 hover:text-black" onClick={()=>setAmount((prev)=>prev-1)}>-</button>
                    <input className="mb-5 w-20 ring rounded-full text-center no-spinner text-2xl" type="text" value={amount} />
                    <button className="h-10 w-10 mx-2 mb-2 rounded-full cursor-pointer text-3xl text-gray-300 hover:text-black" onClick={()=>setAmount((prev)=>prev+1)}>+</button>
                </div>
                <button onClick={addMerchandise} className="bg-[#00C853] py-2 w-35 rounded-full cursor-pointer"><p className="text-2xl text-white font-bold">ยืนยัน</p></button>
            </div>
        </div>
    );
}

export default AddModal;