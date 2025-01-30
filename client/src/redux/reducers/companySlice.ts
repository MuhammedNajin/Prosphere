import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyApi } from "../../api";
import { UsageStatsType } from "@/types/company";
import { SubscriptionData } from "@/types/subscription";

export const getCompaniesThunk = createAsyncThunk("company/getCompanies", CompanyApi.getCompanies);

interface CompanyState {
  companies: any[];
  selectedCompany: any | null;
  selectedCompanySubscription: SubscriptionData | null;
  status: string;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  selectedCompanySubscription: null,
  status: ""
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<any>) => {
      state.selectedCompany = action.payload;
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
        state.companies = action.payload;
        state.status = "success";
      })
      .addCase(getCompaniesThunk.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getCompaniesThunk.pending, (state) => {
        state.status = "loading";
      })
      
  }
});

export const { setSelectedCompany, setCompanySubscription, setTrailLimit } = companySlice.actions;
export const companyReducer = companySlice.reducer;