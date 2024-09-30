import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherData {
  date: string;
  temp: string;
  condition: string;
  icon: string;
}

interface HomeState {
  weatherData: WeatherData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  weatherData: [],
  isLoading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    fetchWeatherStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchWeatherSuccess(state, action: PayloadAction<WeatherData[]>) {
      state.weatherData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchWeatherFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } = homeSlice.actions;

export const store = configureStore({
  reducer: {
    home: homeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;