import { useState, useMemo } from "react";
import { Plus, Edit3, Trash2, X, RefreshCw, Search, Sparkles, IndianRupee, Layers } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "../../features/api/apiSlice";

const initialForm = {
  title: "",
  category: "Casual",
  rate: "",
  durationUnit: "session",
  description: "",
  isActive: true,
};

const categoryStyles = {
  Entertainment: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  Casual: "border-sky-200 bg-sky-50 text-sky-700",
  Nightlife: "border-purple-200 bg-purple-50 text-purple-700",
  Travel: "border-amber-200 bg-amber-50 text-amber-700",
  Dining: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const ServiceCatalogAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading: loading, isFetching, refetch } = useGetServicesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services = data?.services || [];
  const busy = submitting || isCreating || isUpdating;

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  const activeCount = services.filter((s) => s.isActive).length;
  const avgRate = services.length
    ? Math.round(services.reduce((sum, s) => sum + Number(s.rate || 0), 0) / services.length)
    : 0;
  const categoryCount = new Set(services.map((s) => s.category)).size;

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      category: service.category || "Casual",
      rate: service.rate,
      durationUnit: service.durationUnit || "session",
      description: service.description || "",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData, rate: Number(formData.rate) };
      if (editingId) {
        await updateService({ id: editingId, ...payload }).unwrap();
        toast.success("Service package updated successfully!");
      } else {
        await createService(payload).unwrap();
        toast.success("New service package created successfully!");
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service package?")) return;
    try {
      await deleteService(id).unwrap();
      toast.success("Service package deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || err.message || "Error deleting service");
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await updateService({ id: service._id, isActive: !service.isActive }).unwrap();
      toast.success(!service.isActive ? "Service package activated!" : "Service package disabled!");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Services Catalog</h1>
          <p className="text-sm text-slate-500">Manage companion rates, categories, and active platform offerings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            title="Refresh"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <RefreshCw size={16} className={loading || isFetching ? "animate-spin text-violet-600" : ""} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-95"
          >
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-violet-600 shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Services</div>
            <div className="text-xl font-extrabold text-slate-900">{activeCount} <span className="text-sm font-medium text-slate-400">/ {services.length}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-emerald-600 shadow-sm">
            <IndianRupee size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average Rate</div>
            <div className="text-xl font-extrabold text-slate-900">₹{avgRate.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-amber-600 shadow-sm">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories Live</div>
            <div className="text-xl font-extrabold text-slate-900">{categoryCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "Entertainment", "Casual", "Nightlife", "Travel", "Dining"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                categoryFilter === cat
                  ? "border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/25"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Sparkles className="mx-auto mb-3 text-slate-300" size={28} />
          <p className="text-sm text-slate-500">
            {services.length === 0 ? 'No services created yet. Click "Add Service" to create one.' : "No services match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((s) => (
            <div
              key={s._id}
              className={`group relative flex flex-col justify-between space-y-4 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100 ${
                s.isActive ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/70 opacity-70"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${categoryStyles[s.category] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    {s.category}
                  </span>

                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(s)}
                    title={s.isActive ? "Active (Click to disable)" : "Disabled (Click to enable)"}
                    className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                      s.isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        s.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {s.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-violet-600">₹{Number(s.rate).toLocaleString()}</span>
                  <span className="text-xs font-medium text-slate-400">/ {s.durationUnit || "session"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 active:scale-95"
                >
                  <Edit3 size={13} />
                  <span>Edit Package</span>
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100 active:scale-95"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Service Offering" : "Add New Companion Service"}
              </h2>
              <button onClick={() => setShowModal(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Service Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dinner & Conversation Partner"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Casual">Casual</option>
                    <option value="Nightlife">Nightlife</option>
                    <option value="Travel">Travel</option>
                    <option value="Dining">Dining</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Billing Unit</label>
                  <select
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
                  >
                    <option value="session">Per Session</option>
                    <option value="hour">Per Hour</option>
                    <option value="night">Per Night</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Pricing Rate (INR ₹)</label>
                <input
                  required
                  type="number"
                  placeholder="4500"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about what is included in this service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 cursor-pointer accent-violet-600"
                />
                <span className="text-xs font-semibold text-slate-700">Keep this service active on the platform</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Saving..." : editingId ? "Update Service" : "Save Offering"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogAdmin;