"use client";
import Layout from "@/app/components/Layout";
import React, { useState, useEffect } from 'react';
import TextArea from './_components/TextArea';
import Button from './_components/Button';

export default function SettingsPage() {
  const [friendlyTone, setFriendlyTone] = useState('');
  const [mainPrompt, setMainPrompt] = useState('');
  const [llamaModel, setLlamaModel] = useState('');
  

  // State for saved values
  const [savedFriendlyTone, setSavedFriendlyTone] = useState('');
  const [savedMainPrompt, setSavedMainPrompt] = useState('');
  const [savedLlamaModel, setSavedLlamaModel] = useState('');

  // State for showing confirmation modals
  const [showFriendlyToneConfirm, setShowFriendlyToneConfirm] = useState(false);
  const [showMainPromptConfirm, setShowMainPromptConfirm] = useState(false);
  const [showLlamaModelConfirm, setShowLlamaModelConfirm] = useState(false);

  useEffect(() => {
    // Fetch initial settings from the database
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/chatSettings');
        const result = await response.json();

        if (result.success) {
          setSavedFriendlyTone(result.data.friendlyTone);
          setSavedMainPrompt(result.data.mainPrompt);
          setSavedLlamaModel(result.data.llamaModel);

          // Set state values to display in the text areas/input
          setFriendlyTone(result.data.friendlyTone);
          setMainPrompt(result.data.mainPrompt);
          setLlamaModel(result.data.llamaModel);
        } else {
          console.error('Failed to fetch settings:', result.error);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleFriendlyToneSave = async () => {
    try {
      const response = await fetch('/api/chatSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendlyTone,
          mainPrompt: savedMainPrompt,
          llamaModel: savedLlamaModel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSavedFriendlyTone(friendlyTone);
        setFriendlyTone('');
        setShowFriendlyToneConfirm(false); // Hide confirmation modal after save
      } else {
        console.error('Failed to save Friendly Tone:', result.error);
      }
    } catch (error) {
      console.error('Error saving Friendly Tone:', error);
    }
  };

  const handleMainPromptSave = async () => {
    try {
      const response = await fetch('/api/chatSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendlyTone: savedFriendlyTone,
          mainPrompt,
          llamaModel: savedLlamaModel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSavedMainPrompt(mainPrompt);
        setMainPrompt('');
        setShowMainPromptConfirm(false); // Hide confirmation modal after save
      } else {
        console.error('Failed to save Main Prompt:', result.error);
      }
    } catch (error) {
      console.error('Error saving Main Prompt:', error);
    }
  };

  const handleLlamaModelSave = async () => {
    try {
      const response = await fetch('/api/chatSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendlyTone: savedFriendlyTone,
          mainPrompt: savedMainPrompt,
          llamaModel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSavedLlamaModel(llamaModel);
        setLlamaModel('');
        setShowLlamaModelConfirm(false); // Hide confirmation modal after save
      } else {
        console.error('Failed to save Llama Model:', result.error);
      }
    } catch (error) {
      console.error('Error saving Llama Model:', error);
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <Layout>
        {/* Friendly Tone Section */}
        <div className="max-w-7xl mx-auto p-6 bg-gray-800 shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold mb-6">Friendly Tone</h1>
          <TextArea
            value={friendlyTone}
            onChange={(e:any) => setFriendlyTone(e.target.value)}
            placeholder="Type your friendly tone here..."
            rows={6}
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setShowFriendlyToneConfirm(true)}
              text="Save Friendly Tone"
              className="px-6 py-2 bg-blue-500 text-gray-100 font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="mt-4">Current Saved Friendly Tone: <span className="font-semibold">{savedFriendlyTone}</span></p>
        </div>

        {/* Confirmation Modal for Friendly Tone */}
        {showFriendlyToneConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
              <p className="mb-4">Are you sure you want to save the Friendly Tone?</p>
              <div className="flex justify-end">
                <Button
                  onClick={handleFriendlyToneSave}
                  text="Confirm"
                  className="px-4 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                />
                <Button
                  onClick={() => setShowFriendlyToneConfirm(false)}
                  text="Cancel"
                  className="px-4 py-2 bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Prompt Section */}
        <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-800 shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold mb-6">Main Prompt</h1>
          <TextArea
            value={mainPrompt}
            onChange={(e:any) => setMainPrompt(e.target.value)}
            placeholder="Type your main prompt here..."
            rows={6}
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setShowMainPromptConfirm(true)}
              text="Save Main Prompt"
              className="px-6 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <p className="mt-4">Current Saved Main Prompt: <span className="font-semibold">{savedMainPrompt}</span></p>
        </div>

        {/* Confirmation Modal for Main Prompt */}
        {showMainPromptConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
              <p className="mb-4">Are you sure you want to save the Main Prompt?</p>
              <div className="flex justify-end">
                <Button
                  onClick={handleMainPromptSave}
                  text="Confirm"
                  className="px-4 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                />
                <Button
                  onClick={() => setShowMainPromptConfirm(false)}
                  text="Cancel"
                  className="px-4 py-2 bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Llama Model Section */}
        <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-800 shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold mb-6">Llama Model</h1>
          <input
            type="text"
            value={llamaModel}
            onChange={(e) => setLlamaModel(e.target.value)}
            placeholder="Enter Llama Model..."
            className="w-full px-4 py-2 text-gray-900 rounded-md bg-gray-200"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setShowLlamaModelConfirm(true)}
              text="Save Llama Model"
              className="px-6 py-2 bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <p className="mt-4">Current Saved Llama Model: <span className="font-semibold">{savedLlamaModel}</span></p>
        </div>

        {/* Confirmation Modal for Llama Model */}
        {showLlamaModelConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
              <p className="mb-4">Are you sure you want to save the Llama Model?</p>
              <div className="flex justify-end">
                <Button
                  onClick={handleLlamaModelSave}
                  text="Confirm"
                  className="px-4 py-2 bg-green-500 text-gray-100 font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                />
                <Button
                  onClick={() => setShowLlamaModelConfirm(false)}
                  text="Cancel"
                  className="px-4 py-2 bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}
      </Layout>
    </main>
  );
}
