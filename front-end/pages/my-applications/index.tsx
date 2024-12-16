import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import { Application, ApplicationStatus, Reminder } from '@types';
import Spinner from '@components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@components/Modal'; // Assume you have a Modal component
import DatePicker from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css';
import ApplicationService from '@services/applicationService'; // Import the new ApplicationService

const statusOptions: (ApplicationStatus | 'All')[] = ['All', 'Applied', 'Pending', 'Interviewing', 'Rejected', 'Accepted'];

const JobApplicationsOverview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [notesError, setNotesError] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');

  // Modal States for Reminders
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [currentReminderApplicationId, setCurrentReminderApplicationId] = useState<number | null>(null);
  const [currentEditingReminderId, setCurrentEditingReminderId] = useState<number | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string>('');
  const [reminderError, setReminderError] = useState<string>('');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (filterStatus === 'All') {
          response = await ApplicationService.getAllApplications();
        } else {
          response = await ApplicationService.getApplicationsByStatus(filterStatus);
        }

        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData.message || 'Failed to load applications. Please try again later.';
          setError(errorMsg);
          toast.error(errorMsg);
        } else {
          const data: Application[] = await response.json();
          setApplications(data);
        }
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        const errorMessage = err.message || 'Failed to load applications. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [filterStatus]);

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      const response = await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to update status. Please try again.';
        toast.error(errorMsg);
      } else {
        const updatedData = await response.json();
        const updatedApp = updatedData.application;
        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? updatedApp : app))
        );
        toast.success('Application status updated successfully.');
      }
    } catch (err: any) {
      console.error('Error updating application status:', err);
      const errorMessage = err.message || 'Failed to update status. Please try again.';
      toast.error(errorMessage);
    }
  };

  const saveNotes = async (applicationId: number) => {
    if (notes.trim().length === 0) {
      setNotesError('Notes cannot be empty.');
      return;
    }

    try {
      const response = await ApplicationService.updateApplicationNotes(applicationId, notes);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to save notes. Please try again.';
        setNotesError(errorMsg);
        toast.error(errorMsg);
      } else {
        const updatedData = await response.json();
        const updatedApp = updatedData.application;
        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? updatedApp : app))
        );
        setEditingNotesId(null);
        setNotes('');
        setNotesError('');
        toast.success('Notes saved successfully.');
      }
    } catch (err: any) {
      console.error('Error updating notes:', err);
      const errorMessage = err.message || 'Failed to save notes. Please try again.';
      setNotesError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const cancelEditingNotes = () => {
    setEditingNotesId(null);
    setNotes('');
    setNotesError('');
  };

  const startEditingNotes = (applicationId: number, currentNotes: string) => {
    setEditingNotesId(applicationId);
    setNotes(currentNotes || '');
    setNotesError('');
  };

  const discardApplicationHandler = async (applicationId: number) => {
    if (!confirm('Are you sure you want to discard this application? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await ApplicationService.deleteApplication(applicationId);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to discard the application. Please try again.';
        toast.error(errorMsg);
      } else {
        toast.success('Application discarded successfully.');
        setApplications((prevApps) => prevApps.filter((app) => app.id !== applicationId));
      }
    } catch (err: any) {
      console.error('Error discarding application:', err);
      const errorMessage = err.message || 'Failed to discard the application. Please try again.';
      toast.error(errorMessage);
    }
  };

  const openReminderModal = (applicationId: number, reminder?: Reminder) => {
    setCurrentReminderApplicationId(applicationId);
    if (reminder) {
      setCurrentEditingReminderId(reminder.id);
      setReminderDate(new Date(reminder.reminderDate));
      setReminderMessage(reminder.message || '');
    } else {
      setCurrentEditingReminderId(null);
      setReminderDate(null);
      setReminderMessage('');
    }
    setReminderError('');
    setIsReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setCurrentReminderApplicationId(null);
    setCurrentEditingReminderId(null);
    setReminderDate(null);
    setReminderMessage('');
    setReminderError('');
  };

  const saveReminderHandler = async () => {
    if (!currentReminderApplicationId || !reminderDate) {
      setReminderError('Please select a valid reminder date and time.');
      return;
    }

    const isoDate = reminderDate.toISOString();

    try {
      let response;
      if (currentEditingReminderId) {
        response = await ApplicationService.updateReminder(currentEditingReminderId, isoDate, reminderMessage);
      } else {
        response = await ApplicationService.setReminder(currentReminderApplicationId, isoDate, reminderMessage);
      }

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to set/update reminder. Please try again.';
        setReminderError(errorMsg);
        toast.error(errorMsg);
      } else {
        const updatedData = await response.json();
        const updatedReminder = currentEditingReminderId ? updatedData.reminder : updatedData.reminder;

        setApplications(prev =>
          prev.map(app => {
            if (app.id === currentReminderApplicationId) {
              let newReminders = app.reminders || [];
              if (currentEditingReminderId) {
                // Update existing reminder
                newReminders = newReminders.map(rem => rem.id === currentEditingReminderId ? updatedReminder : rem);
              } else {
                // Add new reminder
                newReminders = [...newReminders, updatedReminder];
              }
              return { ...app, reminders: newReminders };
            }
            return app;
          })
        );

        toast.success(currentEditingReminderId ? 'Reminder updated successfully.' : 'Reminder set successfully.');
        closeReminderModal();
      }
    } catch (err: any) {
      console.error('Error setting/updating reminder:', err);
      const errorMessage = err.message || 'Failed to set/update reminder. Please try again.';
      setReminderError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const deleteReminderHandler = async (reminderId: number) => {
    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    try {
      const response = await ApplicationService.deleteReminder(reminderId);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to delete reminder. Please try again.';
        toast.error(errorMsg);
      } else {
        toast.success('Reminder deleted successfully.');
        setApplications(prev =>
          prev.map(app => {
            if (app.reminders) {
              return { ...app, reminders: app.reminders.filter(rem => rem.id !== reminderId) };
            }
            return app;
          })
        );
      }
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      const errorMessage = error.message || 'Failed to delete reminder. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (loading) return <Spinner />;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>

        {/* Filter Section */}
        <div className="flex items-center mb-6">
          <label htmlFor="statusFilter" className="mr-2 font-semibold text-gray-700">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'All')}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between relative">
                {/* Discard Application Icon */}
                <button
                  onClick={() => discardApplicationHandler(application.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label="Discard Application"
                >
                  {/* X Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                    onChange={(e) => handleStatusChange(application.id, e.target.value as ApplicationStatus)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.slice(1).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-3 flex justify-between items-center">
                    <a href={application.resumeUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                    <a href={application.coverLetterUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                </div>


                {/* Reminders Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Reminders:</h3>
                  {application.reminders && application.reminders.length > 0 ? (
                    application.reminders.map(reminder => (
                      <div key={reminder.id} className="p-2 border border-blue-300 rounded bg-blue-50 mb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-blue-700 font-semibold">Date & Time:</p>
                            <p className="text-blue-600">
                              {new Date(reminder.reminderDate).toLocaleString()}
                            </p>
                            {reminder.message && (
                              <p className="text-blue-600 italic">{reminder.message}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openReminderModal(application.id, reminder)}
                              className="text-gray-500 hover:text-green-500 focus:outline-none"
                              aria-label="Edit Reminder"
                            >
                              {/* Pencil Icon SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteReminderHandler(reminder.id)}
                              className="text-gray-500 hover:text-red-500 focus:outline-none"
                              aria-label="Delete Reminder"
                            >
                              {/* Trash Icon SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 5a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reminders set.</p>
                  )}
                  <button
                    onClick={() => openReminderModal(application.id)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors focus:outline-none"
                  >
                    {/* Calendar Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add Reminder
                  </button>
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
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
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
          <h2 className="text-xl font-bold mb-4">{currentEditingReminderId ? 'Edit Reminder' : 'Set Reminder'}</h2>
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
              onClick={saveReminderHandler}
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