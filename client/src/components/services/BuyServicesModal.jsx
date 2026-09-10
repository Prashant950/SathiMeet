import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Check, Loader, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import showCustomToast from "../../utils/toast";
import { openAuthModal } from "../auth/AuthModal";
import { 
  useCreateOrderMutation, 
  useVerifyPaymentMutation,
  useGetPublicServicesCatalogQuery 
} from "../../features/api/apiSlice";

const formatCurrency = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const BuyServicesModal = ({ isOpen, onClose, onPaymentSuccess, preSelectedService }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [selectedIds, setSelectedIds] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  
  const { data: dbCatalogData, isLoading: isCatalogLoading } = useGetPublicServicesCatalogQuery();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const serviceCatalog = useMemo(() => {
    const raw = dbCatalogData?.data || [];
    return raw.map((s) => ({
      id: s._id || s.slug || s.id,
      _id: s._id,
      title: s.title,
      price: typeof s.rate === "number" ? s.rate : parseInt(String(s.price || "0").replace(/\D/g, "")) || 1000,
      category: s.category,
      description: s.description,
      tag: s.tag,
    }));
  }, [dbCatalogData]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentSuccessData(null);
      setError(null);
      return;
    }

    const targetId = preSelectedService?._id || preSelectedService?.id || preSelectedService?.slug;
    if (targetId) {
      // Find matching service in live catalog
      const matched = serviceCatalog.find(
        (s) => s.id === targetId || s.title?.toLowerCase() === preSelectedService?.title?.toLowerCase()
      );
      if (matched) {
        setSelectedIds([matched.id]);
      } else {
        setSelectedIds([targetId]);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, preSelectedService, serviceCatalog]);

  const selectedServices = useMemo(
    () => serviceCatalog.filter((service) => selectedIds.includes(service.id)),
    [selectedIds]
  );

  const subtotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const toggleService = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book companion services 🔐");
      openAuthModal();
      return;
    }

    if (selectedServices.length === 0) {
      const msg = "Please select at least one service";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setPaymentLoading(true);
      setError(null);

      // Transform services to match backend schema (id → serviceId)
      const transformedServices = selectedServices.map((service) => ({
        serviceId: service._id || service.id,
        title: service.title,
        price: service.price,
      }));

      // Step 1: Create order on backend
      const orderResponse = await createOrder({
        services: transformedServices,
        subtotal: subtotal,
        gst: gst,
        total: total
      }).unwrap();

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await verifyPayment({
              orderId: orderResponse.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }).unwrap();

            if (verifyResponse.success) {
              setError(null);
              showCustomToast("Booking & Payment Successful! Services added to your Dashboard. 🎉", "success", "Service Booked");
              setPaymentSuccessData({
                services: selectedServices,
                amount: total,
                orderId: orderResponse.orderId,
                paymentId: response.razorpay_payment_id,
                date: new Date().toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              });
              setSelectedIds([]);
              if (onPaymentSuccess) {
                onPaymentSuccess();
              }
            }
          } catch (verifyError) {
            setError("Payment verification failed: " + verifyError.message);
            toast.error("❌ Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          }
        },
        theme: {
          color: "#ec4899"
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Payment failed";
      setError(errorMessage);
      toast.error("❌ Error: " + errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate("/dashboard?tab=services");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95">
        <div className="max-h-[85vh] overflow-y-auto bg-white p-5 sm:p-6">
          
          {/* SUCCESS SCREEN */}
          {paymentSuccessData ? (
            <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 size={36} className="stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck size={13} />
                  <span>100% ID Verified Booking</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Booking Confirmed! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Your companion service credits have been activated in your account. You can view, track, and use your credits in your Dashboard.
                </p>
              </div>

              {/* Booking Details Card */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-left space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-700">Services Booked:</span>
                  <span className="font-extrabold text-pink-600">
                    {paymentSuccessData.services?.map((s) => s.title).join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Total Paid:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(paymentSuccessData.amount)} (incl. GST)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment ID:</span>
                  <span className="font-mono text-[11px] text-slate-700">{paymentSuccessData.paymentId || "rzp_verified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Date &amp; Time:</span>
                  <span className="text-slate-700 font-medium">{paymentSuccessData.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition"
                >
                  <Sparkles size={16} />
                  <span>Go to Dashboard &amp; View Bookings</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Continue Browsing Catalog
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top Header */}
              <div className="mb-6 flex items-start justify-between text-left">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Book Sathi Meet Services
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 font-normal">
                    Select service credits to book your verified companion
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Service Items Catalog */}
              <div className="space-y-3.5">
                {serviceCatalog.map((service) => {
                  const isSelected = selectedIds.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-pink-600 bg-pink-50/50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-pink-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                          {service.title}
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-pink-600 sm:text-base">
                          {formatCurrency(service.price)}
                          <span className="font-medium text-pink-500">/session</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white shadow-md shadow-pink-200">
                          <Check size={18} strokeWidth={2.5} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Sticky Bottom Pricing & Actions */}
              <div className="sticky bottom-0 mt-6 rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between text-sm font-medium text-slate-700 sm:text-base">
                  <span>{selectedServices.length} services selected</span>
                  <span className="text-base font-bold text-pink-600 sm:text-lg">
                    {formatCurrency(total)}{" "}
                    <span className="text-xs font-normal text-slate-500">(incl. GST)</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={paymentLoading}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white py-2.5 text-base font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={paymentLoading || selectedServices.length === 0}
                    className="cursor-pointer rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-2.5 text-base font-medium text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paymentLoading && <Loader size={16} className="animate-spin" />}
                    {paymentLoading ? "Processing..." : `Pay ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default BuyServicesModal;