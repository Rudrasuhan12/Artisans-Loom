"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts";
import { IndianRupee, TrendingUp, Users, Package, Loader2 } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { getAnalyticsData } from "@/app/actions/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getAnalyticsData();
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="space-y-8 min-h-screen pb-20">
      
      <div>
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Studio Analytics</h1>
        <p className="text-[#8C7B70] mt-2">Track your growth and reach across the globe.</p>
      </div>

      <div className="scale-100 opacity-60"><RoyalDivider /></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Revenue", val: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-[#D97742]" },
          { title: "Active Customers", val: data.totalCustomers, icon: Users, color: "text-[#2F334F]" },
          { title: "Products Sold", val: data.totalSold, icon: Package, color: "text-[#D4AF37]" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#FFFBF5] border border-[#E5DCCA] shadow-md hover:shadow-xl transition-all">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-[#8C7B70] uppercase tracking-wider">{stat.title}</p>
                  <h3 className={`text-3xl font-serif font-bold mt-2 ${stat.color}`}>{stat.val}</h3>
               </div>
               <div className={`p-4 rounded-full bg-white border border-[#E5DCCA] ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card className="bg-[#2C1810] border-[#D4AF37]/20 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-[#FDFBF7] font-serif flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-[#D4AF37]" /> Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <XAxis dataKey="name" stroke="#8C7B70" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8C7B70" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFBF5', borderColor: '#D4AF37', borderRadius: '8px' }}
                  itemStyle={{ color: '#4A3526', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5DCCA] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#4A3526] font-serif flex items-center gap-2">
               <Package className="w-5 h-5 text-[#2F334F]" /> Units Sold
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <XAxis dataKey="name" stroke="#8C7B70" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2C1810', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Line type="monotone" dataKey="count" stroke="#2F334F" strokeWidth={3} dot={{ r: 4, fill: "#D4AF37" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}