import { useEffect, useState  } from 'react';
import Overview from './Overview';
import History from './History';
import Edit from './Edit';
import { motion, AnimatePresence } from "framer-motion";


type tab = 'overview'|'edit'|'history';
const tabOptions: tab[] = ["overview","history", "edit"];
const header = ["สรุป","ประวัติการทำรายการ", "แก้ไขสินค้า"];


const Inventory = () => {
    const [tab, setTab] = useState<tab>(() => {
        const savedTab = localStorage.getItem('selectedTab');
        return (savedTab as tab) || 'overview';
    });
    const [show, setShow] =useState<boolean>(false) ;

    useEffect(() => {
        localStorage.setItem('selectedTab', tab);
    }, [tab]);
    return (
        <div className="p-10 overflow-auto">
            <p className='text-2xl font-bold pb-5'>
                ระบบจัดการหลังร้าน
            </p>
            <div>
                {(tab === 'overview') && <Overview/>}
                {(tab === 'history') && <History/>}
                {(tab === 'edit') && <Edit/>}
            </div>
            <div className='fixed bottom-10 right-10 z-10'>
                <button type='button' onClick={()=>setShow(!show)} className='fixed p-2 flex w-20 h-20 z-10 items-center justify-center bottom-10 right-10 rounded-full bg-[#797979] shadow-xl hover:scale-105 duration-200 cursor-pointer active:scale-100 select-none'> 
                    <img src="img/edit.png" alt="" />
                </button>
                <AnimatePresence>
                {show && (
                    <div className="absolute bottom-20 right-0 flex flex-col items-end space-y-5">
                    {tabOptions.map((val, index) => (
                    <motion.div
                        key={val}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: -20, opacity: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={()=>{
                            setShow(false);
                            setTab(val);
                        }}
                        transition={{ duration: 0.3, delay: index* 0.05 }}
                        className="px-4 py-1 whitespace-nowrap w-fit h-fit bg-[#D9D9D9] rounded-full text-center cursor-pointer text-xl shadow-md"
                    >
                        {header[index]}
                    </motion.div>
                
                    ))}
                    </div>
                )}
                </AnimatePresence>
            </div>
            
        </div>
    )
}

export default Inventory