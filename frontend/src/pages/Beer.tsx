import DebtPage from "../components/DebtPage"

const Beer = () => {
    return (
        <div className="p-10 overflow-auto">
            <p className='text-2xl font-bold pb-5'>
                ระบบบริหารการค้างชำระ
            </p>
            <DebtPage />
        </div>
    )
}

export default Beer