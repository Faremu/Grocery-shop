import type { SelectedItem } from "../../Types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type receiptProps = {
    cart: SelectedItem[];
    onClose: ()=>void;
}

const Receipt = ({cart, onClose}:receiptProps) => {
    const [receive, setReceive] = useState(0);
    const sellMer = async(cart:SelectedItem[]) =>{
        const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
        const payload = {cart,total,receive}
        const res = await axios.post("http://localhost:3000/sell",payload);
        console.log(res.data);
        return res.data;
    }
    const mutation = useMutation({
        mutationFn:sellMer,
        onSuccess: (data)=>{
            console.log("Sale success:", data);
            onClose();
        },
        onError: (err)=>{
            console.error("Sale failed:", err);
        }
    })
    return (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onMouseDown={onClose}>
            <div className="bg-white h-120 w-90 rounded-xl flex flex-col items-center justify-center" onMouseDown={(e) => e.stopPropagation()}>
                <p className="text-2xl mt-5">สรุปยอดรวม</p>
                <p className="my-2">รายการสินค้า</p>
                <hr className="w-70 border-gray-300 mb-5" />
                <div className="h-50">
                    {cart.map((item)=>{
                        return (
                        <div className="flex flex-col mx-10 w-70">
                            <div className="flex flex-row space-x-2">
                                <img className="h-5 w-5" src={`http://localhost:3000/uploads/img/${item.code}.jpg`} alt="" />
                                <p>{item.name}</p>
                                <p>x</p>
                                <p>{item.amount}</p>
                                <p className="ml-auto">{item.price*item.amount}.-</p>
                            </div>
                        </div>
                        );
                    })}
                </div>
                
                <hr className="w-70 border-gray-300 mb-5" />
                <p className="mb-2">รับเงินมา</p>
                <input className="rounded-lg mb-5 border focus:outline-none text-center" type="text" value={receive} onChange={e=>setReceive(Number(e.target.value))}/>
                <button onClick={()=>mutation.mutate(cart)} className="bg-[#00C853] py-2 w-35 rounded-full cursor-pointer"><p className="text-2xl text-white font-bold">ยืนยัน</p></button>
                <p className="text-2xl text-white font-bold">
                    {mutation.isPending ? "กำลังยืนยัน..." : "ยืนยัน"}
                </p>
            </div>
        </div>
    )
}

export default Receipt;