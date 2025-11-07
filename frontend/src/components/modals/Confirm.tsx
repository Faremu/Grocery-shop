import type { SelectedItem } from "../../Types";
import { useState } from "react";

type BoolTypeProps={
    onClose: ()=>void;
    onSelected: (item:SelectedItem)=>void;
    item: SelectedItem;
}
const ConfirmModal = ({onClose, onSelected, item}:BoolTypeProps) =>{
    const [amount, setAmount] = useState(1);
    item.amount = amount;
    return (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white h-120 w-90 rounded-xl flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <p className="text-2xl">รายละเอียดสินค้า</p>
                <img src={`http://localhost:3000/uploads/img/${item.code}.jpg`} className="w-[150px] h-[150px] object-cover" alt="" />
                <p className="text-xl justify-center text-ellipsis overflow-hidden" title={item.name}>{item.name}</p>
                <p className="mb-3 text-gray-500 text-sm">(คงเหลือ : {item.stock} {item.code.slice(0,2)=="BV"?"ขวด":"ชิ้น"})</p>
                <div className="flex flex-row">
                    <p className="font-bold text-5xl">{item.price}</p>
                    <p className="flex items-end pl-2">บาท</p>
                </div>
                
                
                <div className="flex flex-row items-center">
                    <button className="h-10 w-10 m-2 rounded-full cursor-pointer text-3xl text-gray-300 hover:text-black" onClick={()=>setAmount((prev)=>Math.max(prev - 1, 0))}>-</button>
                    <input className="my-5 w-20 ring rounded-full text-center no-spinner text-2xl" type="text" value={amount} />
                    <button className="h-10 w-10 m-2 rounded-full cursor-pointer text-3xl text-gray-300 hover:text-black" onClick={()=>setAmount((prev)=>Math.min(prev + 1, item.stock))}>+</button>
                </div>
                <button onClick={()=>onSelected(item)} className="bg-[#00C853] py-2 w-35 rounded-full cursor-pointer"><p className="text-2xl text-white font-bold">ยืนยัน</p></button>
            </div>
        </div>
    );
}

export default ConfirmModal;