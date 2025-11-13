import type { SelectedItem } from "../../Types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import generatePayload from "promptpay-qr";
import { QRCodeCanvas } from "qrcode.react";
import type { UseMutationResult } from "@tanstack/react-query";

type receiptProps = {
    cart: SelectedItem[];
    onClose: ()=>void;
}
type SellPayload = { cart: SelectedItem[]; total: number; receive: number };
type SellResponse = { success: boolean; message: string }; // replace with your API response type
type CashProps = {
  cart: SelectedItem[];
  receive: string;
  setReceive: (val: string) => void;
  mutation: UseMutationResult<SellResponse, unknown, SellPayload, unknown>;
};

const Cash = ({ cart, receive, setReceive, mutation }: CashProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setReceive(val);
  };

  const handleConfirm = () => {
    const numericReceive = Number(receive);
    const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
    const payload = { cart, total, receive: numericReceive };
    mutation.mutate(payload);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-2 text-xl">รับเงินมา</h1>
      <input
        className="rounded-lg mb-5 border focus:outline-none text-center"
        type="text"
        value={receive}
        onChange={handleChange}
      />
      <button
        onClick={handleConfirm}
        className="bg-[#00C853] py-2 w-35 rounded-full cursor-pointer"
      >
        <p className="text-2xl text-white font-bold">ยืนยัน</p>
      </button>
      <p className="text-2xl text-white font-bold">
        {mutation.isPending ? "กำลังยืนยัน..." : "ยืนยัน"}
      </p>
    </div>
  );
};

const Receipt = ({cart, onClose}:receiptProps) => {
    const [receive, setReceive] = useState<string>("");
    const [payment, setPayment] = useState("");
    const sellMer = async(payload: { cart: SelectedItem[]; total: number; receive: number }) => {
        const res = await axios.post("http://localhost:3000/sell", payload);
        console.log(res.data);
        return res.data;
    };
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
    const PaymentSec = () => {
        return (
            <div>
                <h1>ช่องทางการชำระเงิน</h1>
                <div className="flex flex-row space-x-5 mb-5">
                    <button className="flex w-30 h-17 rounded-xl cursor-pointer rounded-lg hover:shadow-lg justify-center items-center" onClick={()=>setPayment("Promptpay")}>
                        <img className="w-25" src={`/img/PromptPay-logo.png`} alt="" />
                    </button>
                    <button className="w-30 h-17 cursor-pointer rounded-xl hover:shadow-lg" onClick={()=>setPayment("Cash")}>
                        <div className="flex flex-row px-3 justify-between items-center"><img className="h-10" src={`/img/cash.png`} alt="" />เงินสด</div>
                    </button>
                </div>
            </div>
        )
    }
    const Promptpay = () => {
        const pnumber = "0621823172"
        const amount = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
        const payload = generatePayload(pnumber,{ amount });

        return (
            <div>
                <h1 className="text-lg font-semibold mb-2">สแกนเพื่อชำระเงิน</h1>
                <div className="relative w-[250px] h-[250px]">
                <QRCodeCanvas
                    value={payload}
                    size={250}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    />

                    <img
                    src="/img/PromptPay-Icon.png"
                    alt="PromptPay"
                    className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 rounded-md p-1"
                    />
                </div>
                    <p className="text-gray-700 mb-5">
                    <br />
                    จำนวนเงิน: {amount.toFixed(2)} บาท
                    </p>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onMouseDown={onClose}>
            <div className="bg-white h-fit w-90 rounded-xl flex flex-col items-center justify-center" onMouseDown={(e) => e.stopPropagation()}>
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
                {(payment === "")&& <PaymentSec />}
                {(payment === "Promptpay")&& <Promptpay />} 
                {(payment === "Cash")&& <Cash cart={cart} receive={receive} setReceive={setReceive} mutation={mutation} />} 
                
            </div>
        </div>
    )
}

export default Receipt;