// src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ChartModal from '../components/ChartModal';
import DataTable from '../components/DataTable';
import * as AdminService from '../services/adminService';

export default function Admin() {
  const [showChart, setShowChart] = useState(false);
  const [researchers, setResearchers] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Search state

  useEffect(() => {
    AdminService.allResearchers()
      .then(setResearchers)
      .catch(() => setResearchers([]));
  }, []);

  const total = researchers.length;
  const top = [...researchers]
    .sort((a, b) => (b.publication_count || 0) - (a.publication_count || 0))
    .slice(0, 3);

  const columns = [
    { key: 'user_id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'publication_count', title: 'Publications' },
    { key: 'citation_count', title: 'Citations' },
  ];

  // 🔎 Filter researchers by search
  const filteredResearchers = researchers.filter((r) =>
    Object.values(r).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Layout>
      {/* Chart Modal */}
      <ChartModal open={showChart} onClose={() => setShowChart(false)} />

      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          Admin Dashboard
        </h1>

        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowChart(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          View Research Analytics
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Total Researchers */}
        <div className="card p-6 group animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Total Researchers</h3>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-indigo-700">{total}</p>
          <p className="text-sm text-gray-500 mt-2">Active researchers in the system</p>
        </div>

        {/* Top Researchers */}
        <div className="card p-6 group animate-slideIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Top Researchers</h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {top.map((r) => (
              <li key={r.user_id} className="flex items-center justify-between text-sm">
                <span className="truncate max-w-[120px]">{r.name}</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                  {r.publication_count} pubs
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 group animate-slideIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Quick Actions</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <a
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-50"
              href="/projects"
            >
              Manage Projects
            </a>
            <a
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-50"
              href="/datasets"
            >
              View Datasets
            </a>
          </div>
        </div>
      </div>

      {/* All Researchers Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">All Researchers</h3>

          {/* 🔎 Search input */}
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTable columns={columns} data={filteredResearchers} />
      </div>
    </Layout>
  );
}
