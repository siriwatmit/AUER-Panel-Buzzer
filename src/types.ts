export interface ProductModel {
  id: string;
  artNumber: string;
  name: string;
  subtitle: string;
  voltage: "24V AC/DC" | "230V AC";
  soundLevel: "84 dB";
  frequency: "2,400 Hz ± 200 Hz";
  toneTypes: string[];
  protection: "IP65 (Front)";
  mountHole: "Ø 22.5 mm (M22)";
  terminalType: string;
  priceTHB: number;
  originalPriceTHB: number;
  inStock: boolean;
  stockCount: number;
  color: string;
  description: string;
  features: string[];
}

export interface OrderItem {
  modelId: string;
  modelName: string;
  artNumber: string;
  voltage: string;
  priceTHB: number;
  quantity: number;
  accessoryGasket: boolean;
  accessoryNameplate: boolean;
}

export interface OrderDetails {
  fullName: string;
  companyName?: string;
  taxId?: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  postalCode: string;
  paymentMethod: "promptpay" | "bank_transfer" | "credit_card" | "cod";
  notes?: string;
  needTaxInvoice: boolean;
}

export interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  currentText: string;
  currentVoice: "Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr";
  error: string | null;
  audioUrl: string | null;
  duration: number;
}
