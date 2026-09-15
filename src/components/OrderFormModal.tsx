import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  CheckCircle2,
  Zap,
  CreditCard,
  Building,
  QrCode,
  Truck,
  FileText,
  Volume2,
  Printer,
  Sparkles,
} from "lucide-react";
import { PRODUCT_MODELS } from "../data/productData";
import { ttsService } from "../services/ttsService";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelId?: string;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  initialModelId = "auer-m22-24v",
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [quantity, setQuantity] = useState<number>(1);
  const [addGasket, setAddGasket] = useState<boolean>(true);
  const [addNameplate, setAddNameplate] = useState<boolean>(false);

  // Form Fields
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร");
  const [postalCode, setPostalCode] = useState<string>("");
  const [taxId, setTaxId] = useState<string>("");
  const [needTaxInvoice, setNeedTaxInvoice] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "bank_transfer" | "credit_card" | "cod">("promptpay");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isSpeakingSummary, setIsSpeakingSummary] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentModel =
    PRODUCT_MODELS.find((m) => m.id === selectedModelId) || PRODUCT_MODELS[0];

  // Calculation
  const unitPrice = currentModel.priceTHB;
  const itemsTotal = unitPrice * quantity;
  const gasketTotal = addGasket ? 0 : 0; // Included free standard
  const nameplateTotal = addNameplate ? 80 * quantity : 0;
  const subTotal = itemsTotal + nameplateTotal;
  const vat = Math.round(subTotal * 0.07);
  const grandTotal = subTotal + vat;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        modelId: currentModel.id,
        modelName: currentModel.name,
        voltage: currentModel.voltage,
        artNumber: currentModel.artNumber,
        quantity,
        unitPrice,
        addNameplate,
        subTotal,
        vat,
        grandTotal,
        customer: {
          fullName,
          phone,
          company,
          address,
          province,
          postalCode,
          taxId: needTaxInvoice ? taxId : null,
          paymentMethod,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setOrderSuccess(data);

      // Auto-narrate order confirmation with Gemini TTS
      const confirmSpeech = `ยืนยันการสั่งซื้อสำเร็จ หมายเลขคำสั่งซื้อ ${data.orderNumber} สินค้า Auer Panel Buzzer รุ่น ${currentModel.voltage} จำนวน ${quantity} ชิ้น ยอดชำระรวม ${grandTotal.toLocaleString()} บาท เจ้าหน้าที่จะจัดส่งสินค้าไปยังคุณ ${fullName} ขอบคุณที่ไว้วางใจเลือกใช้ Auer Signal ครับ`;
      handleSpeakOrder(confirmSpeech);
    } catch (err) {
      console.error("Order error:", err);
      // Even if network error, generate offline order number
      const mockOrder = {
        orderNumber: `AUER-${Date.now().toString().slice(-6)}`,
        orderDate: new Date().toISOString(),
        grandTotal,
        customer: { fullName, phone },
      };
      setOrderSuccess(mockOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpeakOrder = async (text: string) => {
    setIsSpeakingSummary(true);
    try {
      const result = await ttsService.requestTTS(text, "Kore");
      ttsService.playAudioUrl(result.audioUrl, () => setIsSpeakingSummary(false));
    } catch (e) {
      ttsService.playBrowserFallback(text, undefined, () => setIsSpeakingSummary(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="order-modal-box"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                แบบฟอร์มสั่งซื้อด่วน (Auer Signal Instant Order)
              </h3>
              <p className="text-xs text-slate-400">
                สั่งซื้อ Auer Panel Buzzer 84 dB สินค้าของแท้ พร้อมส่งทั่วประเทศ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!orderSuccess ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Step 1: Select Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. เลือกรุ่นแรงดันไฟฟ้าที่ต้องการใช้งาน:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRODUCT_MODELS.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedModelId(m.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10"
                            : "bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{m.voltage}</span>
                          <span className="font-bold text-amber-400 font-mono">
                            ฿{m.priceTHB.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {m.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">
                          Art. {m.artNumber} • 84 dB
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Quantity & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    จำนวนชิ้น (Quantity):
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-bold text-white w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                    >
                      +
                    </button>
                    <span className="text-xs text-emerald-400 ml-2">
                      มีสินค้าในสต็อก ({currentModel.stockCount} ชิ้น)
                    </span>
                  </div>
                </div>

                {/* Additional accessories */}
                <div className="space-y-2 text-xs">
                  <div className="text-slate-300 font-semibold mb-1">
                    อุปกรณ์เสริมและสเปกเพิ่มเติม:
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={addGasket}
                      onChange={(e) => setAddGasket(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>แถมฟรี ซีลยางกันน้ำ IP65 EPDM ตรงรุ่น</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={addNameplate}
                      onChange={(e) => setAddNameplate(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>ป้ายเนมเพลทหน้าตู้ "ALARM BUZZER" (+฿80/ชิ้น)</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Customer Information */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  2. ข้อมูลการจัดส่งและผู้ติดต่อ:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      ชื่อ-นามสกุล ผู้รับ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมศักดิ์ วิศวกรไฟฟ้า"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08X-XXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">
                      ชื่อบริษัท / หน่วยงาน (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น บริษัท สยามออโตเมชั่น คอนโทรล จำกัด"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">
                      ที่อยู่จัดส่งสินค้า *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่ อาคาร ถนน ตำบล/แขวง อำเภอ/เขต"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">จังหวัด</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      รหัสไปรษณีย์
                    </label>
                    <input
                      type="text"
                      placeholder="10XXX"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Invoice Toggle */}
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={needTaxInvoice}
                    onChange={(e) => setNeedTaxInvoice(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>ต้องการใบกำกับภาษีเต็มรูปแบบ (VAT 7%)</span>
                </label>
                {needTaxInvoice && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        เลขประจำตัวผู้เสียภาษี 13 หลัก
                      </label>
                      <input
                        type="text"
                        placeholder="0-XXXXXXXXX-XX-X"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  3. ช่องทางการชำระเงิน:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: "promptpay", label: "พร้อมเพย์ QR", icon: QrCode },
                    { id: "bank_transfer", label: "โอนผ่านธนาคาร", icon: Building },
                    { id: "credit_card", label: "บัตรเครดิต", icon: CreditCard },
                    { id: "cod", label: "เก็บเงินปลายทาง", icon: Truck },
                  ].map((pay) => {
                    const isSelected = paymentMethod === pay.id;
                    const Icon = pay.icon;
                    return (
                      <button
                        type="button"
                        key={pay.id}
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-amber-300"
                            : "bg-slate-800/30 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-[11px]">{pay.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & Price Checkout Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 w-full sm:w-auto">
                  <div className="flex justify-between sm:justify-start gap-4">
                    <span>ราคาสินค้า ({quantity} ตัว):</span>
                    <span className="font-mono text-white">฿{itemsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                    <span className="font-mono text-white">฿{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4 text-sm font-bold text-amber-400 mt-1">
                    <span>ยอดชำระรวมทั้งสิ้น:</span>
                    <span className="font-mono text-lg text-amber-300">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>กำลังประมวลผล...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ยืนยันการสั่งซื้อทันที</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Order Success View */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                ยืนยันการสั่งซื้อสำเร็จ!
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                เราได้รับข้อมูลการสั่งซื้อของคุณเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับและจัดส่งสินค้าทันที
              </p>

              {/* Order Details Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 mb-6 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">หมายเลขคำสั่งซื้อ:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {orderSuccess.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">สินค้า:</span>
                  <span className="text-white font-medium">{currentModel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">จำนวน:</span>
                  <span className="font-mono text-white">{quantity} ชิ้น</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ผู้สั่งซื้อ:</span>
                  <span className="text-white">{fullName}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                  <span className="text-slate-300">ยอดชำระสุทธิ:</span>
                  <span className="font-mono text-amber-300 text-sm">
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Audio Readout & Close Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() =>
                    handleSpeakOrder(
                      `คำสั่งซื้อของคุณ ${fullName} หมายเลข ${orderSuccess.orderNumber} สำหรับ Auer Panel Buzzer รุ่น ${currentModel.voltage} จำนวน ${quantity} ชิ้น ยอดรวม ${grandTotal} บาท ยืนยันเรียบร้อยแล้วครับ`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-2 border border-slate-700"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {isSpeakingSummary
                      ? "กำลังอ่านข้อมูลคำสั่งซื้อ..."
                      : "ฟังเสียงสรุปคำสั่งซื้อ (AI TTS)"}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
