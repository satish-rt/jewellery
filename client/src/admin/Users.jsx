import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users');
        setUsers(data.users || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Registered Users</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            {users.length} total registrations
          </p>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="bg-[#1A1A1A] border border-gold/20 focus:border-gold px-4 py-2 text-sm outline-none text-cream placeholder-gray-600 transition-colors w-full md:w-72"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users', value: users.length },
          { label: 'This Month', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
          { label: 'This Week', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
        ].map((s, i) => (
          <div key={i} className="bg-[#141414] border border-gold/15 p-5 text-center">
            <p className="font-serif text-2xl text-gold">{s.value}</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-gold/15 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold/15">
              <th className="p-4 text-xs tracking-widest text-gold/60 uppercase font-normal">#</th>
              <th className="p-4 text-xs tracking-widest text-gold/60 uppercase font-normal">Name</th>
              <th className="p-4 text-xs tracking-widest text-gold/60 uppercase font-normal">Email</th>
              <th className="p-4 text-xs tracking-widest text-gold/60 uppercase font-normal">Phone</th>
              <th className="p-4 text-xs tracking-widest text-gold/60 uppercase font-normal text-right">Registered On</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-900">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 bg-[#1E1E1E] animate-pulse rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500 font-serif italic text-lg">
                  {search ? 'No users match your search.' : 'No users registered yet.'}
                </td>
              </tr>
            ) : (
              filtered.map((u, idx) => (
                <tr key={u._id} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                  <td className="p-4 text-xs text-gray-600">{idx + 1}</td>
                  <td className="p-4 font-serif text-cream">{u.name}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    <a href={`mailto:${u.email}`} className="hover:text-gold transition-colors">{u.email}</a>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {u.phone ? <a href={`tel:${u.phone}`} className="hover:text-gold transition-colors">{u.phone}</a> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="p-4 text-right text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <br />
                    <span className="text-gray-700">{new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;