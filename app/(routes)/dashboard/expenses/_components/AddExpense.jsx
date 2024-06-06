import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { Loader } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AddExpense = ({ budgetId, user, refreshdata }) => {

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false);

    const addNewExpense = async () => {
        setLoading(true)
        const result = await db.insert(Expenses).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdAt: moment().format('DD/MM/YYYY')
        }).returning({ insertedId: Budgets.id })

        if (result) {
            setLoading(false)
            setName('')
            setAmount('')
            refreshdata()
            toast("New Expense added successfully!")
        }
        setLoading(false)
    }

    return (
        <div className='p-5 border rounded-lg'>
            <h2 className='text-lg font-bold'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-semibold my-1'>Expense Name</h2>
                <Input placeholder="e.g. Bedroom Decor"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-semibold my-1'>Expense Amount</h2>
                <Input placeholder="e.g. $1000"
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount) || loading}
                className="mt-5 w-full"
                onClick={() => addNewExpense()}
            >
                {loading ? <Loader className='animate-spin' /> : 'Add Expense'}
            </Button>
        </div>
    )
}

export default AddExpense