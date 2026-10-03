import React, { useState, useEffect } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/enquiries");
      setEnquiries(data.enquiries || []);
    } catch (error) {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Enquiries | Lumière Admin";
    fetchEnquiries();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "new" ? "contacted" : "new";
    try {
      await api.put(`/enquiries/${id}`, { status: newStatus });
      toast.success("Status updated");
      setEnquiries(
        enquiries.map((e) => (e._id === id ? { ...e, status: newStatus } : e)),
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredEnquiries =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-serif text-3xl text-cream">Enquiries</h1>

        <div className="flex gap-2">
          {["all", "new", "contacted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "border-gold text-gold bg-gold/10"
                  : "border-gray-800 text-gray-500 hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-charcoal border border-gray-900 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#151515]">
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Date
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Client
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Contact
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Reference
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Status
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Loading enquiries...
                </td>
              </tr>
            ) : filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <React.Fragment key={enquiry._id}>
                  <tr
                    className={`border-b border-gray-900 hover:bg-[#151515] transition-colors ${expandedId === enquiry._id ? "bg-[#151515]" : ""}`}
                  >
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-serif text-cream text-lg">
                      {enquiry.name}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="text-xs text-gray-400 hover:text-gold transition-colors"
                        >
                          {enquiry.email}
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="text-xs text-gray-400 hover:text-gold transition-colors"
                        >
                          {enquiry.phone}
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      {enquiry.productId ? (
                        <span
                          className="text-xs uppercase tracking-widest text-gold cursor-help"
                          title={enquiry.productId.name}
                        >
                          Piece Linked
                        </span>
                      ) : (
                        <span className="text-xs uppercase tracking-widest text-gray-600">
                          General
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm ${
                          enquiry.status === "new"
                            ? "bg-gold/20 text-gold border border-gold/30"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === enquiry._id ? null : enquiry._id,
                          )
                        }
                        className="text-gray-400 hover:text-cream transition-colors text-xs uppercase tracking-widest"
                      >
                        {expandedId === enquiry._id ? "Close" : "View"}
                      </button>
                      <button
                        onClick={() =>
                          toggleStatus(enquiry._id, enquiry.status)
                        }
                        className={`${enquiry.status === "new" ? "text-green-400 hover:text-green-300" : "text-gold hover:text-gold/80"} transition-colors text-xs uppercase tracking-widest`}
                      >
                        Mark {enquiry.status === "new" ? "Contacted" : "New"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Message View */}
                  {expandedId === enquiry._id && (
                    <tr className="bg-[#111] border-b border-gray-900">
                      <td colSpan="6" className="p-8">
                        <div className="max-w-3xl">
                          <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                            Message
                          </h4>
                          <p className="font-serif text-lg text-cream leading-relaxed whitespace-pre-wrap bg-charcoal p-6 border border-gray-800">
                            {enquiry.message}
                          </p>

                          {enquiry.productId && (
                            <div className="mt-6 flex items-center gap-4 bg-charcoal p-4 border border-gray-800 w-max">
                              {enquiry.productId.images?.[0]?.url && (
                                <img
                                  src={enquiry.productId.images[0].url}
                                  alt="Piece"
                                  className="w-12 h-12 object-cover border border-gray-700"
                                />
                              )}
                              <div>
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                                  Referenced Piece
                                </p>
                                <p className="font-serif text-cream">
                                  {enquiry.productId.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;
