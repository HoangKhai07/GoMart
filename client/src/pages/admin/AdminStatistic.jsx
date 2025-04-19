import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi';
import AxiosToastError from '../../utils/AxiosToastError'
import { convertVND } from '../../utils/ConvertVND'

// Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('month'); 

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.get_statistics
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get status order
  const getOrderCountByStatus = (status) => {
    if (!statistics || !statistics.orderStatusCounts) return 0;
    const statusItem = statistics.orderStatusCounts.find(s => s._id === status);
    return statusItem ? statusItem.count : 0;
  };

  // Prepare data for monthly revenue chart
  const prepareMonthlyRevenueData = () => {
    if (!statistics || !statistics.monthlyRevenue) return null;

    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const currentMonth = new Date().getMonth();
    
    // Sort data for 12 months
    const monthlyData = Array(12).fill(0);
    
    statistics.monthlyRevenue.forEach(item => {
      const monthIndex = item._id.month - 1; 
      monthlyData[monthIndex] = item.revenue;
    });

    // Rotate array to start from current month and go back 11 months
    const labels = [];
    const data = [];
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      labels.push(months[monthIndex]);
      data.push(monthlyData[monthIndex]);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        },
      ],
    };
  };

  // Prepare data for weekly revenue chart
  const prepareWeeklyRevenueData = () => {
    if (!statistics || !statistics.weeklyRevenue) return null;

    // Get data for last 12 weeks
    const weeklyData = statistics.weeklyRevenue.slice(-12);
    
    const labels = weeklyData.map((item, index) => {
      const date = new Date(item.firstDay);
      return `Tuần ${index + 1} (${date.getDate()}/${date.getMonth() + 1})`;
    });
    
    const data = weeklyData.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1
        },
      ],
    };
  };

  // Prepare data for yearly revenue chart
  const prepareYearlyRevenueData = () => {
    if (!statistics || !statistics.yearlyRevenue) return null;

    const labels = statistics.yearlyRevenue.map(item => `Năm ${item._id.year}`);
    const data = statistics.yearlyRevenue.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.1
        },
      ],
    };
  };

  // Prepare data for circular order status chart
  const prepareOrderStatusChartData = () => {
    if (!statistics || !statistics.orderStatusCounts) return null;

    const statusLabels = {
      'Preparing order': 'Đang chuẩn bị hàng',
      'Shipping': 'Đang vận chuyển',
      'Out for delivery': 'Đang giao hàng',
      'Delivered': 'Đã giao hàng'
    };

    const labels = statistics.orderStatusCounts.map(item => statusLabels[item._id] || item._id);
    const data = statistics.orderStatusCounts.map(item => item.count);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',  
            'rgba(54, 162, 235, 0.7)',  
            'rgba(255, 206, 86, 0.7)',  
            'rgba(75, 192, 192, 0.7)', 
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getCurrentRevenueData = () => {
    switch (chartView) {
      case 'week':
        return prepareWeeklyRevenueData();
      case 'year':
        return prepareYearlyRevenueData();
      case 'month':
      default:
        return prepareMonthlyRevenueData();
    }
  };

  const getCurrentChartTitle = () => {
    switch (chartView) {
      case 'week':
        return 'Doanh thu theo tuần';
      case 'year':
        return 'Doanh thu theo năm';
      case 'month':
      default:
        return 'Doanh thu theo tháng';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Đang tải...</div>;
  }

  const orderStatusChartData = prepareOrderStatusChartData();
  const currentRevenueData = getCurrentRevenueData();

  return (
    <div className="p-4 overflow-y-scroll max-h-[90vh] no-scrollbar">
      <h1 className="text-2xl font-bold mb-6">Thống kê</h1>
      
      {/* Total statistics card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500 p-4 rounded-lg shadow">
          <h2 className="text-black text-sm">Tổng doanh thu</h2>
          <p className="text-2xl font-bold">{statistics ? convertVND(statistics.totalRevenue) : '0'}</p>
        </div>
        
        <div className="bg-blue-500 p-4 rounded-lg shadow">
          <h2 className="text-black text-sm">Tổng đơn hàng</h2>
          <p className="text-2xl font-bold">{statistics ? statistics.totalOrders : '0'}</p>
        </div>
        
        <div className="bg-yellow-500 p-4 rounded-lg shadow">
          <h2 className="text-black text-sm">Đơn hàng hôm nay</h2>
          <p className="text-2xl font-bold">{statistics ? statistics.todayOrders : '0'}</p>
        </div>
        
        
      </div>
      
      {/* Order status statistics card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Đơn hàng đã giao</h2>
          <p className="text-2xl font-bold">{getOrderCountByStatus('Delivered')}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Đơn hàng đang chuẩn bị</h2>
          <p className="text-2xl font-bold">{getOrderCountByStatus('Preparing order')}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Đơn hàng đang vận chuyển</h2>
          <p className="text-2xl font-bold">{getOrderCountByStatus('Shipping')}</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Đơn hàng đang giao</h2>
          <p className="text-2xl font-bold">{getOrderCountByStatus('Out for delivery')}</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Trạng thái đơn hàng</h2>
          <div className="flex justify-center" style={{ height: '400px' }}>
            {orderStatusChartData && <Pie data={orderStatusChartData} />}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{getCurrentChartTitle()}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartView('week')} 
                className={`px-3 py-1 rounded text-sm ${chartView === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Tuần
              </button>
              <button 
                onClick={() => setChartView('month')} 
                className={`px-3 py-1 rounded text-sm ${chartView === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Tháng
              </button>
              <button 
                onClick={() => setChartView('year')} 
                className={`px-3 py-1 rounded text-sm ${chartView === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Năm
              </button>
            </div>
          </div>
          {currentRevenueData && <Line data={currentRevenueData} />}
        </div>


      </div>
    </div>
  );
};

export default AdminStatistics;