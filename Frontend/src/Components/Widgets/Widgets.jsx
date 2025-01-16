import React from 'react';
import {
  CalendarToday as CalendarTodayIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SendIcon from '@mui/icons-material/Send';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import BackpackIcon from '@mui/icons-material/Backpack';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

// Map titles to icons
const iconMap = {
  'Yesterday Leads': <CalendarTodayIcon />,
  'Yesterday Budget': <CurrencyRupeeIcon />,
  'Yesterday Expense': <TrendingUpIcon />,
  'Yesterday Explained DMP': <HeadphonesIcon />,
  'Yesterday Lead Sent': <SendIcon />,
  'Yesterday Pack Sent': <BackpackIcon />,
  'Yesterday Enrolled': <ContentPasteIcon />,
  'Yesterday DI Amount': <InfoIcon />, // Default InfoIcon for now
};

const Widgets = ({ title, value }) => {
  return (
    <div className="bg-[#ff7200] p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
      {/* Icon Section */}
      <div className="relative mb-4">
        <div className="absolute top-2 right-2 text-gray-100 text-3xl">
          {iconMap[title] || <AutoGraphIcon />}
        </div>
      </div>

      {/* Title Section */}
      <div className="text-gray-100 text-lg font-semibold mb-2">{title}</div>

      {/* Value Section */}
      <div className="text-gray-100 text-2xl font-bold">{value}</div>
    </div>
  );
};

export default Widgets;
