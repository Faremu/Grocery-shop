import type { SelectedItem } from '../Types';

type MerchandiseProps = {
    data: SelectedItem[];
    onOpen: (item:SelectedItem) => void;
};

const Merchandise = ( {data,onOpen}:MerchandiseProps ) => {
    const onClickHandler = (item:SelectedItem) =>{
        if(item.stock == 0){
            return
        }else{
            onOpen(item);
        }
    }
    return (
        <div className="m-10">
            <p className="text-2xl">สินค้าทั้งหมด</p>
            <div className='my-10 pl-10'>
                <p className="text-xl mb-5">สินค้าขายดี</p>
                <div className='flex flex-row space-x-3'>
                    {data.map(item => (
                            <div key={item.code} className={`relative bg-white w-45 h-45 p-4 rounded-xl shadow-lg flex flex-row items-center ${item.stock==0?"cursor-not-allowed":"cursor-pointer"}`} onClick={() => onClickHandler(item)}>
                                {item.stock==0 && <div className='absolute inset-0 select-none z-50 text-5xl bg-black/50 w-full rounded-xl h-full text-white flex justify-center items-center'>หมด</div>}
                                <img src={`http://localhost:3000/uploads/img/${item.code}.jpg`} className="w-[90px] h-[90px] object-cover" alt="" />
                                <div className='flex flex-col w-full '>
                                    <p className="h-15 pt-5 text-sm font-bold justify-center text-ellipsis overflow-hidden" title={item.name}>{item.name}</p>
                                    <p className="font-bold text-5xl">{item.price}</p>
                                    <p className='flex justify-center'>บาท</p>
                                </div>
                            
                            </div>
                    ))}
                </div>
            </div>
            <div className='my-10 pl-10'>
                <p className="text-xl mb-5">ขนม</p>
                <div className='flex flex-row space-x-3'>
                    {data.filter(item => item.code.slice(0,2)==="SN").map(item => (
                            <div key={item.code} className={`relative bg-white w-45 h-45 p-4 rounded-xl shadow-lg flex flex-row items-center ${item.stock==0?"cursor-not-allowed":"cursor-pointer"}`} onClick={() => onClickHandler(item)}>
                                {item.stock==0 && <div className='absolute inset-0 select-none z-50 text-5xl bg-black/50 w-full rounded-xl h-full text-white flex justify-center items-center'>หมด</div>}
                                <img src={`http://localhost:3000/uploads/img/${item.code}.jpg`} className="w-[90px] h-[90px] object-cover" alt="" />
                                <div className='flex flex-col w-full '>
                                    <p className="h-15 pt-5 text-sm font-bold justify-center text-ellipsis overflow-hidden" title={item.name}>{item.name}</p>
                                    <p className="font-bold text-5xl">{item.price}</p>
                                    <p className='flex justify-center'>บาท</p>
                                </div>
                            
                            </div>
                    ))}
                </div>
            </div>
            
            <div className='my-10 pl-10'>
                <p className="text-xl mb-5">เครื่องดื่ม</p>
                <div className='flex flex-row space-x-3'>
                    {data.filter(item => item.code.slice(0,2)==="AL").map(item => (
                            <div key={item.code} className={`relative bg-white w-45 h-45 p-4 rounded-xl shadow-lg flex flex-row items-center ${item.stock==0?"cursor-not-allowed":"cursor-pointer"}`} onClick={() => onClickHandler(item)}>
                                {item.stock==0 && <div className='absolute inset-0 select-none z-50 text-5xl bg-black/50 w-full rounded-xl h-full text-white flex justify-center items-center'>หมด</div>}
                                <img src={`http://localhost:3000/uploads/img/${item.code}.jpg`} className="w-[90px] h-[90px] object-cover" alt="" />
                                <div className='flex flex-col w-full '>
                                    <p className="h-15 pt-5 text-sm font-bold justify-center text-ellipsis overflow-hidden" title={item.name}>{item.name}</p>
                                    <p className="font-bold text-5xl">{item.price}</p>
                                    <p className='flex justify-center'>บาท</p>
                                </div>
                            
                            </div>
                    ))}
                </div>
            </div>
            
           
            
        </div>
    );
}

export default Merchandise
