/** @jsx createElement */
import { createElement, useState, useEffect } from './jsx-runtime';
import { DataService, DataPoint } from './data-service';
import { Chart } from './chart';
import { Card, Modal, Form, Input } from './components';

// src/dashboard.tsx
// Part 4.1: Main Dashboard Component

// Khởi tạo data service
const dataService = new DataService();

const Dashboard = () => {
  // TODO: Create main dashboard component

  // --- State ---
  const [data, setData] = useState<DataPoint[]>(dataService.getData());
  // *** THAY ĐỔI: Đặt 'pie' làm biểu đồ mặc định ***
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('pie');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [newDataLabel, setNewDataLabel] = useState('');
  const [newDataValue, setNewDataValue] = useState(0);

  // --- Effects ---
  // TODO: Real-time data updates
  useEffect(() => {
    if (isSimulating) {
      dataService.simulateRealTimeUpdates(setData);
    } else {
      dataService.stopUpdates();
    }
    
    // Cleanup function
    return () => dataService.stopUpdates();
  }, [isSimulating]);
  

  // --- Event Handlers ---
  const handleChartTypeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setChartType(target.value as 'bar' | 'line' | 'pie');
  };
  
  const handleToggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };
  
  const handleAddData = (e: Event) => {
    e.preventDefault();
    if (newDataLabel && newDataValue > 0) {
      const newDataPoint = { label: newDataLabel, value: newDataValue, category: 'Manual' };
      setData(prevData => [...prevData, newDataPoint]);
      // Đặt lại form
      setNewDataLabel('');
      setNewDataValue(0);
      setIsModalOpen(false);
    }
  };

  // --- Styles (Chủ đề HỒNG) ---
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)', // Bóng mờ màu hồng
    borderRadius: '12px',
    border: '1px solid #fce4ec', // Viền hồng
  };
  
  const controlGroupStyle = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    margin: '25px 5px'
  };
  
  const selectStyle = {
    padding: '10px 14px',
    fontSize: '0.95em',
    borderRadius: '8px',
    border: '1px solid #f8bbd0', // Viền hồng
    backgroundColor: '#fef7fa', // Nền hồng nhạt
    fontFamily: "'Inter', sans-serif",
  };
  
  const buttonStyle = {
    padding: '10px 18px',
    fontSize: '0.95em',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#e91e63', // Màu hồng chính
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontFamily: "'Inter', sans-serif",
  };
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginTop: '25px', // Thêm margin top vì giờ nó nằm trên
  };

  // --- Render ---
  return (
    <div className="dashboard">
      {/* 1. Header */}
      <header style={headerStyle}>
        <h1 style={{ margin: 0, color: '#ad1457', fontWeight: '700' }}>My Dashboard</h1>
        <button style={{ ...buttonStyle, backgroundColor: '#e91e63' }} onClick={() => setIsModalOpen(true)}>
          Add Data
        </button>
      </header>

      {/* *** THAY ĐỔI: 2. Stats Grid (Đã chuyển lên đây) *** */}
      <div className="stats-grid" style={gridStyle}>
        <Card title="Total Value">
          <h2 style={{ margin: 0, color: '#ad1457' }}> {/* Màu hồng đậm */}
            ${data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </h2>
        </Card>
        <Card title="Data Points">
          <h2 style={{ margin: 0, color: '#e91e63' }}> {/* Màu hồng chính */}
            {data.length}
          </h2>
        </Card>
        <Card title="Average Value">
           <h2 style={{ margin: 0, color: '#f06292' }}> {/* Màu hồng nhạt */}
            ${(data.reduce((sum, d) => sum + d.value, 0) / (data.length || 1)).toFixed(0)}
          </h2>
        </Card>
      </div>

      {/* 3. Controls (Đã chuyển xuống đây) */}
      <div className="controls" style={controlGroupStyle}>
        <label htmlFor="chartType" style={{ fontWeight: '500' }}>Chart Type:</label>
        {/* *** THAY ĐỔI: Đặt 'pie' lên đầu tiên *** */}
        <select id="chartType" onInput={handleChartTypeChange} style={selectStyle}>
          <option value="pie">Pie</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        
        {/* Nút "Stop" (vẫn giữ màu đỏ) và "Start" (màu hồng) */}
        <button style={{ ...buttonStyle, backgroundColor: isSimulating ? '#d32f2f' : '#e91e63' }} onClick={handleToggleSimulation}>
          {isSimulating ? 'Stop Simulation' : 'Start Real-time Data'}
        </button>
      </div>

      {/* 4. Main Chart (Đã chuyển xuống đây) */}
      <Card title={`Sales Data (${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)`}>
        <Chart type={chartType} data={data} width={700} height={400} />
      </Card>
      
      {/* Modal (Vị trí không ảnh hưởng) */}
      <Modal title="Add New Data Point" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form onSubmit={handleAddData}>
          <label htmlFor="dataLabel" style={{ fontWeight: '500' }}>Label:</label>
          <Input 
            id="dataLabel"
            type="text" 
            value={newDataLabel} 
            onInput={(e: Event) => setNewDataLabel((e.target as HTMLInputElement).value)} 
            placeholder="e.g., Day 8"
          />
          <label htmlFor="dataValue" style={{ marginTop: '10px', fontWeight: '500' }}>Value:</label>
          <Input
            id="dataValue"
            type="number"
            value={newDataValue}
            onInput={(e: Event) => setNewDataValue(parseInt((e.target as HTMLInputElement).value, 10))}
            placeholder="e.g., 500"
          />
          <button type="submit" style={{ ...buttonStyle, marginTop: '15px', width: '100%' }}>
            Add
          </button>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;