import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyApi } from "../../api";
import { UsageStatsType } from "@/types/company";
import { SubscriptionData } from "@/types/subscription";

// Fixed thunk to extract payload from nested response
export const getCompaniesThunk = createAsyncThunk(
  "company/getCompanies", 
  async () => {
    const response = await CompanyApi.getMyCompany();
    // Extract the actual company data from response.data.payload
    return response.data.payload;
  }
);

interface CompanyState {
  companies: any[];
  currentCompany: any | null;
  selectedCompanySubscription: SubscriptionData | null;
  status: string;
}

const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  selectedCompanySubscription: null,
  status: ""
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCurrentCompany: (state, action: PayloadAction<any>) => {
      state.currentCompany = action.payload;
    },

    setCompanySubscription: (state, action: PayloadAction<any>) => {
      state.selectedCompanySubscription = action.payload;
    },

    setTrailLimit: (state, action: PayloadAction<UsageStatsType>) => {
      if(state.selectedCompanySubscription) {
        if (state.selectedCompanySubscription.usageLimit) {
          state.selectedCompanySubscription.usageLimit[action.payload]++;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompaniesThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        console.log("Fetched companies:", action.payload);
        state.companies = action.payload; 
        state.status = "success";
      })
      .addCase(getCompaniesThunk.rejected, (state) => {
        state.status = "failed";
        state.companies = []; 
      })
      .addCase(getCompaniesThunk.pending, (state) => {
        state.status = "loading";
      })
  }
});

export const { setCurrentCompany, setCompanySubscription, setTrailLimit } = companySlice.actions;
export const companyReducer = companySlice.reducer;