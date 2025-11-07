import { NavLink } from 'react-router-dom'

const Sidenav = () => {
    return (
        <>
        <div className="w-40 min-h-screen py-20 bg-[#D9D9D9] bg-linear-45 from-[rgba(0,0,0,0.2)] to-[rgba(255,255,255,0.2)] text-lg">
            <NavLink to='/' className={({isActive})=>`flex flex-row py-1 items-center justify-center duration-300 cursor-pointer ${ isActive ? "bg-white":"hover:bg-white"}`}>
                <img src="/img/front.png" alt="" className="h-8 w-8 mr-2 "/>
                <div>หน้าร้าน</div>
            </NavLink>
            <NavLink to='/inventory' className={({isActive})=>`flex flex-row py-1 items-center justify-center duration-300 cursor-pointer ${ isActive ? "bg-white":"hover:bg-white"}`}>
                <img src="/img/back.png" alt="" className="h-7 w-7 mr-2 "/>
                <div>หลังร้าน</div>
            </NavLink>
            <NavLink to='/beer' className={({isActive})=>`flex flex-row py-1 items-center justify-center duration-300 cursor-pointer ${ isActive ? "bg-white":"hover:bg-white"}`}>
                <img src="/img/beer.svg" alt="" className="h-5 w-5 mr-3 ml-1"/>
                <div>สายดื่ม</div>
            </NavLink>
            
        </div>
        </>
    );
}

export default Sidenav