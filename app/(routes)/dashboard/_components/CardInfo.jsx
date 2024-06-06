import { PiggyBank, Receipt, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CardInfo = ({ budgetList }) => {

    const [totalBudget, setTotalBudget] = useState(0)
    const [totalSpend, setTotalSpend] = useState(0)

    useEffect(() => {
        calculateCardInfo();
    }, [budgetList])

    const calculateCardInfo = () => {
        let total_budget = 0;
        let total_spend = 0;

        budgetList.forEach(element => {
            total_budget = total_budget + Number(element.amount);
            total_spend = total_spend + element.totalSpend;
        })

        setTotalBudget(total_budget)
        setTotalSpend(total_spend)
    }

    return (
        <div>
            {budgetList.length ? (
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='text-2xl font-bold'>${totalBudget}</h2>
                        </div>
                        <PiggyBank
                            className='bg-primary p-3 h-12 w-12 rounded-full text-white'
                        />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spend</h2>
                            <h2 className='text-2xl font-bold'>${totalSpend}</h2>
                        </div>
                        <Receipt
                            className='bg-primary p-3 h-12 w-12 rounded-full text-white'
                        />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>No. of Budget</h2>
                            <h2 className='text-2xl font-bold'>{budgetList?.length}</h2>
                        </div>
                        <Wallet
                            className='bg-primary p-3 h-12 w-12 rounded-full text-white'
                        />
                    </div>
                </div>
            ) : (
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {[1, 2, 3].map((item, index) => (
                        <div className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'></div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CardInfo