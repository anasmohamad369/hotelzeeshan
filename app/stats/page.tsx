"use client"

import { useEffect, useState } from "react"
import Nav from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { TrendingUp, DollarSign, Package, Award, Loader2 } from "lucide-react"

interface StatItem {
    _id: string
    totalQty: number
    totalRevenue: number
}

// Vibrant color palette
const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#FF8856', '#8E44AD', '#3498DB', '#E74C3C', '#1ABC9C'
]

export default function StatsPage() {
    const [stats, setStats] = useState<StatItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true)
                const response = await fetch('http://localhost:3001/stats')

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics')
                }

                const data = await response.json()
                setStats(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load statistics')
                console.error('Error fetching stats:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    // Calculate summary metrics
    const totalRevenue = stats.reduce((sum, item) => sum + item.totalRevenue, 0)
    const totalItemsSold = stats.reduce((sum, item) => sum + item.totalQty, 0)
    const topSellingItem = stats.length > 0 ? stats[0] : null
    const uniqueItems = stats.length

    // Prepare chart data
    const top10Items = stats.slice(0, 10)
    const barChartData = top10Items.map(item => ({
        name: item._id.length > 20 ? item._id.substring(0, 20) + '...' : item._id,
        fullName: item._id,
        quantity: item.totalQty,
        revenue: item.totalRevenue,
    }))

    const pieChartData = top10Items.map(item => ({
        name: item._id,
        value: item.totalRevenue,
    }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <Nav />
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Sales Analytics
                    </h1>
                    <p className="text-muted-foreground">Track your best-performing items and revenue insights</p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading statistics...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl shadow-sm">
                        <p className="font-semibold">Error loading statistics</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!loading && !error && stats.length === 0 && (
                    <div className="text-center py-20">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground text-lg">No statistics available yet</p>
                    </div>
                )}

                {!loading && !error && stats.length > 0 && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-blue-100">Total Revenue</CardTitle>
                                        <DollarSign className="h-5 w-5 text-blue-100" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                                    <p className="text-xs text-blue-100 mt-1">From all sales</p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-green-100">Items Sold</CardTitle>
                                        <TrendingUp className="h-5 w-5 text-green-100" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{totalItemsSold.toLocaleString()}</div>
                                    <p className="text-xs text-green-100 mt-1">Total quantity</p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-orange-100">Top Seller</CardTitle>
                                        <Award className="h-5 w-5 text-orange-100" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold truncate">{topSellingItem?._id || 'N/A'}</div>
                                    <p className="text-xs text-orange-100 mt-1">{topSellingItem?.totalQty || 0} sold</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Bar Chart - Quantity */}
                            <Card className="border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Top 10 Items by Quantity</CardTitle>
                                    <CardDescription>Most frequently ordered items</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={barChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fill: '#64748b' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value: number, name: string) => {
                                                    if (name === 'quantity') return [value, 'Quantity']
                                                    return [value, name]
                                                }}
                                                labelFormatter={(label: string) => {
                                                    const item = barChartData.find(d => d.name === label)
                                                    return item?.fullName || label
                                                }}
                                            />
                                            <Bar
                                                dataKey="quantity"
                                                fill="#4F46E5"
                                                radius={[8, 8, 0, 0]}
                                                animationDuration={1000}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            
                        </div>

                        {/* Detailed Table */}
                        <Card className="border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Detailed Statistics</CardTitle>
                                <CardDescription>Complete breakdown of all items</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Rank</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Item Name</th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Quantity Sold</th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Revenue</th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Avg. Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.map((item, index) => (
                                                <tr
                                                    key={item._id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-medium">{item._id}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                            {item.totalQty}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-green-600 dark:text-green-400">
                                                        ₹{item.totalRevenue.toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                                        ₹{Math.round(item.totalRevenue / item.totalQty)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
        </div>
    )
}
