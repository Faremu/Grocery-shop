import Summary from "../components/Summary"
import ConfirmModal from '../components/modals/Confirm'
import Receipt from "../components/modals/Receipt"
import Merchandise from "../components/Merchandise"
import type { SelectedItem } from "../Types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchMerchandise = async ():Promise<SelectedItem[]> => {
    const res = await axios.get("http://localhost:3000/merlist");
    return res.data;
}

const Home = () =>{
    const [showCFModal,setShowCFModal] = useState(false);
    const [showRCModal,setShowRCModal] = useState(false);
    const [showItem,setShowItem] = useState<SelectedItem| null>(null);
    const [selectedItems,setSelectedItems] = useState<SelectedItem[]>([]);
    const {data:merchandise = [], isLoading, isError, error} = useQuery<SelectedItem[]>({
        queryKey: ['merData'],
        queryFn: fetchMerchandise,
    });
    const stock = merchandise.map(item => {
        const selected = selectedItems.find(sel => sel.code === item.code);
        return {
            ...item,
            stock: selected ? item.stock - selected.amount : item.stock,
        };
    });
    const onCloseHandle = () => {
        setShowItem(null);
        setShowCFModal(false);
        setShowRCModal(false);
    }
    const onOpenCFHandle = (item:SelectedItem) => {
        setShowItem(item);
        setShowCFModal(true);
    }
    const onOpenRCHandle = () => {
        setShowRCModal(true);
    }

    const onSelectedHandle = (newItem:SelectedItem) => {
        setShowCFModal(false);
        setSelectedItems(prev=>{
            const existing = selectedItems.find(item=>item.code == newItem.code)
            if(existing){
                return prev.map((item)=>{
                    if(item.code == newItem.code){
                        return {...item, amount: item.amount+newItem.amount,}
                    }else{
                        return item
                    }
                })
            }else{
                return [...prev, newItem]
            }
        })
    }
    const onReset = () =>{
        setSelectedItems([]);
    }
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;
    return(
        <>
            <Summary cart={selectedItems} onOpen={onOpenRCHandle} onReset={onReset}/>
            <Merchandise data={stock} onOpen={onOpenCFHandle} />
            {showCFModal && showItem && <ConfirmModal item={showItem} onSelected={onSelectedHandle} onClose={onCloseHandle}/>}
            {showRCModal && <Receipt cart={selectedItems} onClose={onCloseHandle}/>}
        </>
    );
}
export default Home