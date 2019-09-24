import {BusinessType} from "@/types/business";

export interface MerchantType {
  merchant_name: string;
  business_id: number;
  id: number;
  business: BusinessType;
}
