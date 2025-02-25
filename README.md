# Weather Now

A modern weather application built with Next.js 15 that provides current weather conditions and 5-day forecasts for cities worldwide.

**Live Demo:** [https://weathernow-beta.vercel.app/](https://weathernow-beta.vercel.app/)

## Features

- **Current Weather Data**: Get real-time weather information including temperature, feels-like temperature, humidity, wind speed, and pressure
- **5-Day Forecast**: View weather predictions for the next 5 days
- **Detailed Forecast View**: Click on any forecast day to see hourly predictions and additional details
- **Dark/Light Mode**: Toggle between dark and light themes based on your preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Search History**: Automatically remembers your last searched city
- **Theme Persistence**: Saves your theme preference between sessions

## Technologies Used

- **Next.js 15**: React framework for building the application
- **React 19**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessible design
- **Shadcn UI**: Beautiful, accessible UI components
- **OpenWeather API**: Data source for weather information
- **Next-themes**: Theme management for Next.js applications

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-now.git
   cd weather-now
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenWeather API key:

   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

   You can get an API key by signing up at [OpenWeather](https://openweathermap.org/api).

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
weather-now/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── weather/     # Weather-specific components
│   │       ├── CurrentWeather.jsx
│   │       ├── ForecastCard.jsx
│   │       ├── ForecastDetail.jsx
│   │       ├── SearchForm.jsx
│   │       └── WeatherIcon.jsx
│   ├── lib/             # Utility functions and configurations
│   └── utils/
│       └── weatherService.js  # Weather API integration
├── .env.local           # Environment variables (not in repo)
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies
└── tailwind.config.mjs  # Tailwind CSS configuration
```

## Customization

- **Theme**: Modify the theme colors in `tailwind.config.mjs`
- **API Endpoints**: Update API endpoints in `src/utils/weatherService.js`
- **UI Components**: Customize UI components in the `src/components` directory

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add your environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenWeather](https://openweathermap.org/) for providing the weather data API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for headless UI components
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the weather icons
