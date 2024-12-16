const getAllApplications = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const getApplicationsByStatus = (status: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/status?status=${encodeURIComponent(status)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const updateApplicationStatus = (applicationId: number, newStatus: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
  };
  
  const updateApplicationNotes = (applicationId: number, notes: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    });
  };
  
  const deleteApplication = (applicationId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const setReminder = (applicationId: number, reminderDate: string, message?: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reminderDate, message }),
    });
  };
  
  const updateReminder = (reminderId: number, reminderDate: string, message?: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/reminders/${reminderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reminderDate, message }),
    });
  };
  
  const deleteReminder = (reminderId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/reminders/${reminderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const ApplicationService = {
    getAllApplications,
    getApplicationsByStatus,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
    setReminder,
    updateReminder,
    deleteReminder,
  };
  
  export default ApplicationService;