// front-end/pages/my-applications/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@components/header';
import { Application, Reminder } from '@types';
import Spinner from '@components/Spinner';
import { XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@components/Modal'; // Assume you have a Modal component
import DatePicker from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css';


const JobApplicationsOverview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [notesError, setNotesError] = useState<string>('');
  const [savingNotesId, setSavingNotesId] = useState<number | null>(null);

    // Modal States for Reminders
    const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
    const [currentReminderApplicationId, setCurrentReminderApplicationId] = useState<number | null>(null);
    const [reminderDate, setReminderDate] = useState<Date | null>(null);
    const [reminderMessage, setReminderMessage] = useState<string>('');
    const [reminderError, setReminderError] = useState<string>('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get<Application[]>('http://localhost:3000/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load job applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId: number, newStatus: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted') => {
    try {
      // Update status on the server
      await axios.put(`http://localhost:3000/applications/${applicationId}`, { status: newStatus });
      
      // Update state locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update status. Please try again.');
    }
  };  

  const discardApplication = async (applicationId: number) => {
    if (!confirm('Are you sure you want to discard this job application? This will delete the job and all associated applications. This action cannot be undone.')) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3000/applications/${applicationId}`);
        // Remove the job and its applications from the state
        setApplications(prevApps => prevApps.filter(app => app.id !== applicationId));
        alert('Job and related applications discarded successfully.');
    } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to discard the job application. Please try again.');
        console.error('Error discarding job application:', err);
    }
};

  const startEditingNotes = (applicationId: number, currentNotes: string) => {
    setEditingNotesId(applicationId);
    setNotes(currentNotes || '');
    setNotesError('');
  };

  const cancelEditingNotes = () => {
    setEditingNotesId(null);
    setNotes('');
    setNotesError('');
  };

  const saveNotes = async (applicationId: number) => {
    if (notes.trim().length === 0) {
      setNotesError('Notes cannot be empty.');
      return;
    }

    setSavingNotesId(applicationId);

    try {
      // Update notes on the server
      await axios.put(`http://localhost:3000/applications/${applicationId}/notes`, { notes });

      // Update state locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, notes } : app
        )
      );

      setEditingNotesId(null);
      setNotes('');
      setNotesError('');
    } catch (error) {
      console.error('Error updating notes:', error);
      setNotesError('Failed to save notes. Please try again.');
    }
  };

    // Open Reminder Modal
    const openReminderModal = (applicationId: number, existingReminder?: Reminder) => {
      setCurrentReminderApplicationId(applicationId);
      if (existingReminder) {
        setReminderDate(new Date(existingReminder.reminderDate));
        setReminderMessage(existingReminder.message || '');
      } else {
        setReminderDate(null);
        setReminderMessage('');
      }
      setReminderError('');
      setIsReminderModalOpen(true);
    };
    
    // Close Reminder Modal
    const closeReminderModal = () => {
      setIsReminderModalOpen(false);
      setCurrentReminderApplicationId(null);
      setReminderDate(null);
      setReminderMessage('');
      setReminderError('');
    };
    
    // Save Reminder
    const saveReminder = async () => {
      if (!currentReminderApplicationId || !reminderDate) {
        setReminderError('Please select a valid reminder date and time.');
        return;
      }
      
      const isoDate = reminderDate.toISOString();
      
      try {
        // Check if application already has a reminder
        const application = applications.find(app => app.id === currentReminderApplicationId);
        if (application?.reminder) {
          // Update existing reminder
          await axios.put(`http://localhost:3000/applications/reminders/${application.reminder.id}`, {
            reminderDate: isoDate,
            message: reminderMessage,
          });
          setApplications(prev =>
            prev.map(app =>
              app.id === currentReminderApplicationId
                ? { ...app, reminder: { ...app.reminder!, reminderDate: isoDate, message: reminderMessage } }
                : app
            )
          );
          toast.success('Reminder updated successfully.');
        } else {
          // Set new reminder
          const response = await axios.post(`http://localhost:3000/applications/${currentReminderApplicationId}/reminder`, {
            reminderDate: isoDate,
            message: reminderMessage,
          });
          const newReminder: Reminder = response.data.reminder;
          setApplications(prev =>
            prev.map(app =>
              app.id === currentReminderApplicationId
                ? { ...app, reminder: newReminder }
                : app
            )
          );
          toast.success('Reminder set successfully.');
        }
        closeReminderModal();
      } catch (error: any) {
        console.error('Error setting/updating reminder:', error);
        setReminderError('Failed to set/update reminder. Please try again.');
        toast.error('Failed to set/update reminder. Please try again.');
      }
    };
    
    // Delete Reminder
    const deleteReminder = async (applicationId: number) => {
      if (!confirm('Are you sure you want to delete this reminder?')) {
        return;
      }

      try {
        const application = applications.find(app => app.id === applicationId);
        if (!application?.reminder) {
          toast.error('No reminder found to delete.');
          return;
        }

        await axios.delete(`http://localhost:3000/applications/reminders/${application.reminder.id}`);
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId ? { ...app, reminder: undefined } : app
          )
        );
        toast.success('Reminder deleted successfully.');
      } catch (error) {
        console.error('Error deleting reminder:', error);
        toast.error('Failed to delete reminder. Please try again.');
      }
    };

  if (loading) return <Spinner />;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
        {loading ? (
          <p>Loading job applications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between relative">
                {/* Discard X Icon */}
                <button
                  onClick={() => discardApplication(application.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label="Discard Job"
                >
                  {/* X Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <h2 className="text-xl font-semibold mb-2">{application.jobTitle}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>Company:</strong> {application.companyName}
                </p>
                <p className="text-gray-800 mb-2">
                  <strong>Applied on:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                <div className="mb-2">
                  <label htmlFor={`status-${application.id}`} className="block text-gray-700 font-semibold mb-1">
                    Application Status:
                  </label>
                  <select
                    id={`status-${application.id}`}
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Pending">Pending</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </div>
                <div className="pt-3 flex justify-between items-center">
                    <a href={application.resumeUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                    <a href={application.coverLetterUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                </div>


                {/* Set Reminder Button or Reminder Details */}
                <div className="mt-4">
                  {application.reminder ? (
                    <div className="p-2 border border-blue-300 rounded bg-blue-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-700 font-semibold">Reminder:</p>
                          <p className="text-blue-600">
                            {new Date(application.reminder.reminderDate).toLocaleString()}
                          </p>
                          {application.reminder.message && (
                            <p className="text-blue-600 italic">{application.reminder.message}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openReminderModal(application.id, application.reminder)}
                            className="text-gray-500 hover:text-green-500 focus:outline-none"
                            aria-label="Edit Reminder"
                          >
                            {/* Pencil Icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteReminder(application.id)}
                            className="text-gray-500 hover:text-red-500 focus:outline-none"
                            aria-label="Delete Reminder"
                          >
                            {/* Trash Icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5m16 0h-1V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v1h-1" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openReminderModal(application.id, application.reminder)}
                      className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none"
                    >
                      {/* Calendar Icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Set Reminder
                    </button>
                  )}
                </div>

                {/* Notes Section */}
                <div className="mt-4">
                  {editingNotesId === application.id ? (
                    <div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your notes here..."
                      ></textarea>
                      {notesError && <p className="text-red-500 text-sm mt-1">{notesError}</p>}
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => saveNotes(application.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingNotes}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={`notes-${application.id}`} className="block text-gray-700 font-semibold mb-1">
                        Notes:
                      </label>
                      <p className="text-gray-800 mb-2">{application.notes || 'No notes added.'}</p>
                      <button
                        onClick={() => startEditingNotes(application.id, application.notes || '')}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Add/Edit Notes
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p>You haven't applied for any jobs yet.</p>
        )}
      </main>

      {/* Reminder Modal */}
      {isReminderModalOpen && (
        <Modal onClose={closeReminderModal}>
          <h2 className="text-xl font-bold mb-4">Set Reminder</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Reminder Date & Time:</label>
            <DatePicker
              selected={reminderDate}
              onChange={(date: Date) => setReminderDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select date and time"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Message (Optional):</label>
            <textarea
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a message for your reminder"
            ></textarea>
          </div>
          {reminderError && <p className="text-red-500 mb-2">{reminderError}</p>}
          <div className="flex justify-end space-x-2">
            <button
              onClick={saveReminder}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={closeReminderModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default JobApplicationsOverview;
