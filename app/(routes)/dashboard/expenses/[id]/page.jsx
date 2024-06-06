"use client"
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from '../_components/AddExpense'
import ExpenseListtable from '../_components/ExpenseListtable'
import { Button } from '@/components/ui/button'
import { PenBox, Trash } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import EditBudget from '../_components/EditBudget'

const ExpensesScreen = ({ params }) => {

    const { user } = useUser()
    const route = useRouter()
    const [budgetInfo, setBudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState([])

    useEffect(() => {
        user && getBudgetInfo()
    }, [user])

    const getBudgetInfo = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id)

        setBudgetInfo(result[0])
        getExpenseList()
    }

    const getExpenseList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .orderBy(desc(Expenses.id))

        setExpensesList(result)
    }

    const deleteBudget = async () => {
        const deleteExpense = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .returning()

        if (deleteExpense) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
                .returning()
        }
        toast("Budget Deleted!")
        route.replace('/dashboard/budgets')
    }

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>My Expenses</h2>
                <div className='flex gap-2 items-center'>
                    <EditBudget
                        budgetInfo={budgetInfo}
                        refreshData={() => getBudgetInfo()}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex items-center" variant="destructive"><Trash /> Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current
                                    budget along with expenses and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                {budgetInfo ? <BudgetItem
                    budget={budgetInfo}
                /> :
                    <div className='h-[150px] w-full rounded-lg bg-slate-100 animate-pulse'></div>}
                <AddExpense
                    budgetId={params.id}
                    user={user}
                    refreshdata={() => getBudgetInfo()}
                />
            </div>
            <div>
                <ExpenseListtable
                    expensesList={expensesList}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
        </div>
    )
}

export default ExpensesScreen