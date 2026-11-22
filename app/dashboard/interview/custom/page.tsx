"use client";

import { useState } from "react";

export default function CustomInterviewPage() {
  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Custom Interview
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Software Engineer"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Company Name
          </label>
          <input
            type="text"
            placeholder="Google"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Experience Level
          </label>
          <select className="w-full border rounded-lg p-3">
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Interview Type
          </label>
          <select className="w-full border rounded-lg p-3">
            <option>Behavioral</option>
            <option>Technical</option>
            <option>Mixed</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Number of Questions
          </label>
          <select className="w-full border rounded-lg p-3">
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
          </select>
        </div>

        <button
          onClick={() => setShowQuestions(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Generate Interview
        </button>

        {showQuestions && (
          <div>
            <h2>Generated Interview</h2>

            <ol className="list-decimal ml-6">
              <li>Tell me about yourself.</li>
              <li>Why are you interested in this position?</li>
              <li>Describe a difficult challenge you solved.</li>
              <li>How do you handle competing priorities?</li>
              <li>What is your greatest professional accomplishment?</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}