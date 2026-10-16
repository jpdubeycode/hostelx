
import { createContext, useCallback, useContext } from 'react';
import  useLocalStorage  from '../hooks/useLocalStorage';
import { initialComplaints, COMPLAINT_STATUSES } from '../data/complaints';

const ComplaintsContext = createContext(null);

function createComplaintId() {
  return `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useLocalStorage(
    'complaints',
    initialComplaints,
  );

  const addComplaint = useCallback(
    (complaintData, studentId) => {
      if (studentId === undefined || studentId === null || studentId === '') {
        throw new Error('Student information is missing. Please log in again.');
      }

      const title = complaintData.title?.trim();
      const description = complaintData.description?.trim();
      const category = complaintData.category?.trim();

      if (!title || !description || !category) {
        throw new Error('Please complete all required complaint fields.');
      }

      const now = new Date().toISOString();

      const complaint = {
        id: createComplaintId(),
        studentId,
        category,
        title,
        description,
        priority: complaintData.priority || 'medium',
        status: 'submitted',
        assignedTo: '',
        location: complaintData.location?.trim() || '',
        adminResponse: '',
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            status: 'submitted',
            at: now,
            by: `Student ${studentId}`,
            note: 'Complaint submitted successfully.',
          },
        ],
      };

      setComplaints((current) => [complaint, ...current]);
      return complaint;
    },
    [setComplaints],
  );

  const updateStatus = useCallback(
    (complaintId, nextStatus, by = 'Admin', note = '') => {
      if (!COMPLAINT_STATUSES.includes(nextStatus)) {
        throw new Error('Invalid complaint status.');
      }

      const complaint = complaints.find(
        (item) => String(item.id) === String(complaintId),
      );

      if (!complaint) {
        throw new Error('Complaint not found.');
      }

      if (complaint.status === 'resolved' && nextStatus !== 'resolved') {
        throw new Error('Resolved complaints cannot be reopened in this demo.');
      }

      if (complaint.status === nextStatus) return complaint;

      const now = new Date().toISOString();

      const updatedComplaint = {
        ...complaint,
        status: nextStatus,
        updatedAt: now,
        timeline: [
          ...(complaint.timeline || []),
          {
            status: nextStatus,
            at: now,
            by,
            note: note.trim() || `Status changed to ${nextStatus.replace('_', ' ')}.`,
          },
        ],
      };

      setComplaints((current) =>
        current.map((item) =>
          String(item.id) === String(complaintId) ? updatedComplaint : item,
        ),
      );

      return updatedComplaint;
    },
    [complaints, setComplaints],
  );

  const assignComplaint = useCallback(
    (complaintId, assignedTo, by = 'Admin') => {
      const assignee = assignedTo.trim();

      if (!assignee) {
        throw new Error('Enter a name or team to assign this complaint.');
      }

      const complaint = complaints.find(
        (item) => String(item.id) === String(complaintId),
      );

      if (!complaint) {
        throw new Error('Complaint not found.');
      }

      if (complaint.status === 'resolved') {
        throw new Error('A resolved complaint cannot be reassigned.');
      }

      const now = new Date().toISOString();
      const nextStatus =
        complaint.status === 'submitted' ? 'assigned' : complaint.status;

      const updatedComplaint = {
        ...complaint,
        assignedTo: assignee,
        status: nextStatus,
        updatedAt: now,
        timeline: [
          ...(complaint.timeline || []),
          {
            status: nextStatus,
            at: now,
            by,
            note: `Assigned to ${assignee}.`,
          },
        ],
      };

      setComplaints((current) =>
        current.map((item) =>
          String(item.id) === String(complaintId) ? updatedComplaint : item,
        ),
      );

      return updatedComplaint;
    },
    [complaints, setComplaints],
  );

  const respondToComplaint = useCallback(
    (complaintId, response, by = 'Admin') => {
      const message = response.trim();

      if (!message) {
        throw new Error('Enter a response before saving.');
      }

      const complaint = complaints.find(
        (item) => String(item.id) === String(complaintId),
      );

      if (!complaint) {
        throw new Error('Complaint not found.');
      }

      const now = new Date().toISOString();

      const updatedComplaint = {
        ...complaint,
        adminResponse: message,
        updatedAt: now,
        timeline: [
          ...(complaint.timeline || []),
          {
            status: complaint.status,
            at: now,
            by,
            note: `Admin response: ${message}`,
          },
        ],
      };

      setComplaints((current) =>
        current.map((item) =>
          String(item.id) === String(complaintId) ? updatedComplaint : item,
        ),
      );

      return updatedComplaint;
    },
    [complaints, setComplaints],
  );

  const value = {
    complaints,
    addComplaint,
    updateStatus,
    assignComplaint,
    respondToComplaint,
  };

  return (
    <ComplaintsContext.Provider value={value}>
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);

  if (!context) {
    throw new Error(
      'useComplaints must be used inside ComplaintsProvider.',
    );
  }

  return context;
}
