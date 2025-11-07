import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { SelectedItem } from "../Types";

const fetchTopData = async (): Promise<SelectedItem[]> => {
  const res = await axios.get('http://localhost:3000/top');
  return res.data;
};

const Top = () => {
    const { data = [], isLoading, isError, error } = useQuery<SelectedItem[]>({
        queryKey: ['topData'],
        queryFn: fetchTopData,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;

    return (
    <div className="mt-10 mb-30 w-full h-80 bg-white shadow-lg rounded-xl p-5">
        <h1 className="mb-5 text-4xl">ยอดขายสูงสุด</h1>
        <div className="flex flex-row gap-5">
            {data.map((item,index)=>(
                <div key={index} className="bg-white w-34 p-4 rounded-xl relative">
                    <p className="absolute">{index+1}</p>
                    <img src={`http://localhost:3000/uploads/img/${item.code}.jpg`} className="w-[100px] h-[100px] object-cover" alt="" />
                    <p className="text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden" title={item.name}>{item.name}</p>
                    <p className="text-sm text-gray-500">ขาย: {item.sold}</p>
                </div>
            ))}
            
        </div>
    </div>
    );
}

export default Top