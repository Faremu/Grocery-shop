import { useState,useEffect } from "react";
import type { SelectedItem } from "../Types";

type SumProps = {
    cart: SelectedItem[];
    onReset: ()=>void;
    onOpen: ()=>void;
}

const Summary = ({cart, onReset,onOpen}:SumProps) => {
    const [total, setTotal] = useState<number>(0)
    const onClickHandler = () => {
        onOpen();
    }
    useEffect(()=>{
        const sum = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
        setTotal(sum)
    },[cart])
    
    return (
        
        <div className="h-100 w-full rounded-bl-4xl rounded-br-4xl shadow-xl py-5 pl-5 bg-white">
            <p className='text-2xl font-bold pb-5'>
                Grocery Shop
            </p>
            <div className="flex flex-row">
                <div className="flex flex-row bg-[#F4F4F4] w-full rounded-3xl mr-10">
                    <div className="bg-[#D9D9D9] h-70 w-[50%] p-5 rounded-3xl relative">
                        <p className="absolute text-xl">ยอดรวม</p>
                        <p className="flex items-center justify-self-center h-full text-6xl">{Number(total).toLocaleString('en-US',{minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="bg-[#F4F4F4] h-70 w-full p-5 rounded-3xl mr-10">
                        <p className="text-xl mb-10">รายการสินค้าที่เลือก</p>
                        {cart.map((item)=>{
                            return (
                            <div className="flex flex-col mx-10">
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
                </div>
                
                <div className="flex flex-col">
                    <button aria-label="เคลียร์สินค้า" title="เคลียร์สินค้า" draggable={false} className="h-20 w-30 rounded-l-lg bg-[#FF4D4D] p-3 mt-15 mb-5 drop-shadow-xl/20 hover:drop-shadow-xl/30 duration-300 cursor-pointer active:translate-y-1" onClick={onReset}>
                        <img draggable={false} src="./img/clear.svg" alt="" className="h-full w-full"/>
                    </button>
                    <button disabled={cart.length === 0} onClick={onClickHandler} aria-label="ชำระสินค้า" draggable={false} className="h-20 w-30 rounded-l-lg bg-[#00C853] p-3 drop-shadow-xl/20 hover:drop-shadow-xl/30 duration-300 cursor-pointer active:translate-y-1" >
                        <img draggable={false} src="./img/submit.svg" alt="" className="h-full w-full"/>
                    </button>
                    
                </div>
            </div>
            
        </div>

    );
}

export default Summary