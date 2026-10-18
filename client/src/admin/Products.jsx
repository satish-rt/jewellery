import React, { useState, useEffect } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Products | Lumière Admin";
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });
    } else {
      reset({ category: "gold", inStock: true });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("description", data.description || "");
      formData.append("weight", data.weight || "");
      formData.append("purity", data.purity || "");
      formData.append("inStock", data.inStock);

      if (data.imageFiles && data.imageFiles.length > 0) {
        for (let i = 0; i < data.imageFiles.length; i++) {
          formData.append("images", data.imageFiles[i]);
        }
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", formData);
        toast.success("Product created successfully");
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.map((e) => e.msg).join(", ")
          : "Operation failed");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this piece?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-cream">Products</h1>
        <button
          onClick={() => openModal()}
          className="bg-gold text-charcoal px-6 py-2 text-xs uppercase tracking-widest font-medium hover:bg-cream transition-colors"
        >
          + Add Piece
        </button>
      </div>

      <div className="bg-charcoal border border-gray-900 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#151515]">
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Image
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Name
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Category
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Price
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal">
                Stock
              </th>
              <th className="p-4 text-xs tracking-widest text-gray-500 uppercase font-normal text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Loading pieces...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-900 hover:bg-[#151515] transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        (product.category === "silver"
                          ? "https://images.unsplash.com/photo-1611591475879-11c9118c7c97?auto=format&fit=crop&w=150&q=80"
                          : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80")
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          product.category === "silver"
                            ? "https://images.unsplash.com/photo-1611591475879-11c9118c7c97?auto=format&fit=crop&w=150&q=80"
                            : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80";
                      }}
                      className="w-12 h-12 object-cover border border-gray-800 rounded-sm"
                    />
                  </td>
                  <td className="p-4 font-serif text-cream text-lg">
                    {product.name}
                  </td>
                  <td className="p-4 uppercase text-xs tracking-wider text-gray-400">
                    {product.category}
                  </td>
                  <td className="p-4 text-gold">
                    {formatter.format(product.price)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm ${product.inStock ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                    >
                      {product.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openModal(product)}
                      className="text-gray-400 hover:text-gold transition-colors text-xs uppercase tracking-widest"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-gray-400 hover:text-red-400 transition-colors text-xs uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-charcoal border border-gray-800 w-full max-w-2xl p-8 relative my-8">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-cream"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="font-serif text-3xl text-cream mb-6">
              {editingProduct ? "Edit Piece" : "Add New Piece"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream appearance-none"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true })}
                    className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-2 border border-gray-800 bg-[#111]">
                    <input
                      type="checkbox"
                      {...register("inStock")}
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm uppercase tracking-widest text-cream">
                      In Stock
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14g"
                    {...register("weight")}
                    className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Purity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18k Solid Gold"
                    {...register("purity")}
                    className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  {...register("description")}
                  className="w-full bg-[#111] border border-gray-800 focus:border-gold px-4 py-2 outline-none text-cream resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("imageFiles")}
                  className="w-full bg-[#111] border border-gray-800 p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:bg-gray-800 file:text-cream hover:file:bg-gray-700"
                />
                {editingProduct?.images?.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {editingProduct.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img.url || img}
                          alt="product"
                          className="h-16 w-16 object-cover border border-gray-700 opacity-60 hover:opacity-100"
                          title="Existing image"
                        />
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingProduct) return;
                              try {
                                const q = new URLSearchParams();
                                if (img.publicId) q.set('publicId', img.publicId);
                                if (img.url) q.set('url', img.url);
                                await api.delete(`/products/${editingProduct._id}/images?${q.toString()}`);
                                toast.success('Image removed');
                                const { data } = await api.get('/products');
                                const refreshed = data.products.find(p => p._id === editingProduct._id);
                                setEditingProduct(refreshed);
                                fetchProducts();
                              } catch (err) {
                                toast.error('Failed to remove image');
                              }
                            }}
                            className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            title="Remove image"
                          >
                            ×
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              // create a hidden file input to pick replacement image
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = async (e) => {
                                const file = e.target.files && e.target.files[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('image', file);
                                try {
                                  await api.patch(`/products/${editingProduct._id}/images/${img._id}`, formData);
                                  toast.success('Image replaced');
                                  const { data } = await api.get('/products');
                                  const refreshed = data.products.find(p => p._id === editingProduct._id);
                                  setEditingProduct(refreshed);
                                  fetchProducts();
                                } catch (err) {
                                  toast.error(err.response?.data?.message || 'Failed to replace image');
                                }
                              };
                              input.click();
                            }}
                            className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            title="Replace image"
                          >
                            ↻
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-900">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold text-charcoal px-8 py-2 text-xs uppercase tracking-widest font-medium hover:bg-cream transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Piece"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
