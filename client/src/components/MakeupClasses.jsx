import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MakeupClasses = () => {
  const [makeupClasses, setMakeupClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMakeup, setEditingMakeup] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: 1,
    original_class_id: '',
    makeup_date: '',
    makeup_time: '',
    duration_minutes: '',
    reason: '',
    absent_dates: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [makeupResponse, studentsResponse] = await Promise.all([
        api.get('/makeup-classes'),
        api.get('/students')
      ]);
      setMakeupClasses(makeupResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error fetching makeup classes data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMakeup) {
        await api.put(`/makeup-classes/${editingMakeup.id}`, formData);
        toast.success('Makeup class updated successfully');
      } else {
        await api.post('/makeup-classes', formData);
        toast.success('Makeup class scheduled successfully');
      }
      setShowModal(false);
      setEditingMakeup(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save makeup class');
    }
  };

  const handleEdit = (makeupClass) => {
    setEditingMakeup(makeupClass);
    setFormData({
      student_id: makeupClass.student_id,
      teacher_id: makeupClass.teacher_id,
      original_class_id: makeupClass.original_class_id || '',
      makeup_date: makeupClass.makeup_date,
      makeup_time: makeupClass.makeup_time,
      duration_minutes: makeupClass.duration_minutes,
      reason: makeupClass.reason || '',
      absent_dates: makeupClass.absent_dates || '',
      status: makeupClass.status,
      notes: makeupClass.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this makeup class?')) {
      try {
        await api.delete(`/makeup-classes/${id}`);
        toast.success('Makeup class deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete makeup class');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/makeup-classes/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      teacher_id: 1,
      original_class_id: '',
      makeup_date: '',
      makeup_time: '',
      duration_minutes: '',
      reason: '',
      absent_dates: '',
      status: 'scheduled',
      notes: ''
    });
  };

  const handleAddNew = () => {
    setEditingMakeup(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon className="h-4 w-4" />;
      case 'scheduled': return <ClockIcon className="h-4 w-4" />;
      case 'cancelled': return <XMarkIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Makeup Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage makeup classes for absent students
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Schedule Makeup
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 p-3 rounded-md">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Scheduled
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {makeupClasses.filter(mc => mc.status === 'scheduled').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-500 p-3 rounded-md">
                  <CheckIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {makeupClasses.filter(mc => mc.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-red-500 p-3 rounded-md">
                  <XMarkIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cancelled
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {makeupClasses.filter(mc => mc.status === 'cancelled').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Makeup Classes Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Makeup Class Schedule
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {makeupClasses.map((makeupClass) => (
            <li key={makeupClass.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                      makeupClass.student_name && makeupClass.student_name.includes('KM') ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                      {makeupClass.student_name ? makeupClass.student_name.charAt(0) : '?'}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {makeupClass.student_name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(makeupClass.status)}`}>
                          {getStatusIcon(makeupClass.status)}
                          <span className="ml-1">{makeupClass.status}</span>
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(new Date(makeupClass.makeup_date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {makeupClass.makeup_time} • {makeupClass.duration_minutes} minutes
                        </div>
                        {makeupClass.reason && (
                          <div className="mt-1 text-sm text-gray-600">
                            Reason: {makeupClass.reason}
                          </div>
                        )}
                        {makeupClass.absent_dates && (
                          <div className="mt-1 text-sm text-red-600 font-medium">
                            Absent Dates: {makeupClass.absent_dates}
                          </div>
                        )}
                        {makeupClass.notes && (
                          <div className="mt-1 text-sm text-gray-600">
                            Notes: {makeupClass.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {makeupClass.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(makeupClass.id, 'completed')}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(makeupClass.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(makeupClass)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(makeupClass.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {makeupClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No makeup classes scheduled yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMakeup ? 'Edit Makeup Class' : 'Schedule Makeup Class'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Student *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.manager_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Makeup Date *</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.makeup_date}
                      onChange={(e) => setFormData({...formData, makeup_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">Makeup Time *</label>
                    <input
                      type="time"
                      required
                      className="input-field"
                      value={formData.makeup_time}
                      onChange={(e) => setFormData({...formData, makeup_time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Reason</label>
                  <input
                    type="text"
                    placeholder="e.g., T/A Aug 7, S/A Aug 8"
                    className="input-field"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Absent Dates *</label>
                  <input
                    type="text"
                    placeholder="e.g., Aug 7, 2024; Aug 8, 2024"
                    className="input-field"
                    value={formData.absent_dates}
                    onChange={(e) => setFormData({...formData, absent_dates: e.target.value})}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the dates when the student was absent (separate multiple dates with semicolons)
                  </p>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingMakeup ? 'Update' : 'Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeupClasses;
