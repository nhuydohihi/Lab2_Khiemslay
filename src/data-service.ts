// src/data-service.ts
// Part 4.1: Mock Data Service

// TODO: Create a mock data service
// TODO: Define structure for chart data
export interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

export class DataService {
  private data: DataPoint[];
  private intervalId: number | null = null;

  constructor() {
    this.data = this.generateMockData();
  }

  // TODO: Methods to:
  // - Generate mock data
  public generateMockData(count = 7): DataPoint[] {
    const categories = ['Electronics', 'Books', 'Clothing', 'Home'];
    const data: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        label: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 100,
        category: categories[i % categories.length],
      });
    }
    this.data = data;
    return data;
  }

  public getData(): DataPoint[] {
    return this.data;
  }

  // - Simulate real-time updates
  public simulateRealTimeUpdates(callback: (newData: DataPoint[]) => void, interval = 2000) {
    if (this.intervalId) {
      this.stopUpdates();
    }

    this.intervalId = window.setInterval(() => {
      // Thêm một điểm dữ liệu mới và xóa một điểm cũ
      const newLabel = `Day ${this.data.length + 1}`;
      const newValue = Math.floor(Math.random() * 1000) + 100;
      
      const newData = [
        ...this.data.slice(1),
        { label: newLabel, value: newValue, category: 'Misc' }
      ];
      
      this.data = newData;
      callback(this.data);
    }, interval);
  }

  public stopUpdates() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // - Filter data by category/date (Placeholder)
  public filterData(category: string): DataPoint[] {
    if (category === 'all') {
      return this.data;
    }
    return this.data.filter(d => d.category === category);
  }
}