import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Bookings Chart',
    },
  },
};

const BOOKINGS_BUCKETS = {
  Cheap: { min: 0, max: 1000 },
  Normal: { min: 1000, max: 2000 },
  Expensive: { min: 2000, max: 30000 },
};

const BookingChart = ({ bookings }) => {
  const barData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingCount = bookings.reduce((prev, curr) => {
      if (
        curr.event.price > BOOKINGS_BUCKETS[bucket].min &&
        curr.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingCount);
    barData.labels.push(bucket);
    barData.datasets.push({
      label: '',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return <Bar data={barData} options={options} />;
};

export default BookingChart;
