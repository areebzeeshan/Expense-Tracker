"use client"
import React, { useEffect, useState } from 'react'
import ExpenseListtable from './_components/ExpenseListtable';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';

const expenses = () => {

    const [budgetList, setBudgetList] = useState([])
    const [expensesList, setExpensesList] = useState([])

    const { user } = useUser();

    useEffect(() => {
        user && getBudgetList()
    }, [user])

    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalitem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id))

        setBudgetList(result);
        getAllExpenses();
    }

    const getAllExpenses = async () => {
        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt
        }).from(Budgets)
            .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(Expenses.id))

        setExpensesList(result)
    }

    return (
        <div className='p-5'>
            <ExpenseListtable
                expensesList={expensesList}
                refreshData={() => getBudgetList()}
            />
        </div>
    )
}

export default expenses