import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: 1,
    start_time: '',
    end_time: '',
    duration_minutes: '',
    days_of_week: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesResponse, studentsResponse] = await Promise.all([
        api.get('/classes'),
        api.get('/students')
      ]);
      setClasses(classesResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await api.put(`/classes/${editingClass.id}`, formData);
        toast.success('Class updated successfully');
      } else {
        await api.post('/classes', formData);
        toast.success('Class created successfully');
      }
      setShowModal(false);
      setEditingClass(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save class');
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      student_id: classItem.student_id,
      teacher_id: classItem.teacher_id,
      start_time: classItem.start_time,
      end_time: classItem.end_time,
      duration_minutes: classItem.duration_minutes,
      days_of_week: classItem.days_of_week,
      start_date: classItem.start_date,
      end_date: classItem.end_date,
      status: classItem.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${id}`);
        toast.success('Class deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      teacher_id: 1,
      start_time: '',
      end_time: '',
      duration_minutes: '',
      days_of_week: '',
      start_date: '',
      end_date: '',
      status: 'active'
    });
  };

  const handleAddNew = () => {
    setEditingClass(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage class schedules and timetables
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Class
          </button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Class Schedule
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {classes.map((classItem) => (
            <li key={classItem.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                      classItem.manager_type === 'KM' ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                      {classItem.student_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {classItem.student_name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          classItem.manager_type === 'KM' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {classItem.manager_type}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                          {classItem.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {classItem.start_time} - {classItem.end_time} ({classItem.duration_minutes} min)
                        </div>
                        <div className="flex items-center mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {classItem.days_of_week} • {format(new Date(classItem.start_date), 'MMM dd, yyyy')} - {format(new Date(classItem.end_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem.id)}
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
        
        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No classes scheduled yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingClass ? 'Edit Class' : 'Add New Class'}
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
                    <label className="label">Start Time *</label>
                    <input
                      type="time"
                      required
                      className="input-field"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">End Time *</label>
                    <input
                      type="time"
                      required
                      className="input-field"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
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
                  <label className="label">Days of Week *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., M-F, W & F"
                    className="input-field"
                    value={formData.days_of_week}
                    onChange={(e) => setFormData({...formData, days_of_week: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date *</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">End Date *</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                    {editingClass ? 'Update' : 'Create'}
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

export default Classes;
