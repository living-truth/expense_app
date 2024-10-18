import {dashboard, expenses,  trend, Chatbot } from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        path: '/',
    },
    {
        id: 2,
        title: "Incomes",
        icon: trend,
        path: '/income',
    },
    {
        id: 3,
        title: "Expenses",
        icon: expenses,
        path: '/expenses',
    },

    {
        id:4,
        title: "Chatbot",
        icon: Chatbot,
        path: '/chatbot',
    }
   
]