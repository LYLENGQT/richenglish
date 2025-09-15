import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [formData, setFormData] = useState({
    class_id: '',
    student_id: '',
    teacher_id: 1,
    date: '',
    status: 'present',
    minutes_attended: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [attendanceResponse, classesResponse] = await Promise.all([
        api.get(`/attendance?date=${selectedDate}`),
        api.get('/classes')
      ]);
      setAttendance(attendanceResponse.data);
      setClasses(classesResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance', formData);
      toast.success('Attendance recorded successfully');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to record attendance');
    }
  };

  const handleQuickAttendance = async (classId, studentId, status) => {
    try {
      await api.post('/attendance', {
        class_id: classId,
        student_id: studentId,
        teacher_id: 1,
        date: selectedDate,
        status: status,
        minutes_attended: status === 'present' ? 20 : 0,
        notes: ''
      });
      toast.success('Attendance updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  const resetForm = () => {
    setFormData({
      class_id: '',
      student_id: '',
      teacher_id: 1,
      date: selectedDate,
      status: 'present',
      minutes_attended: '',
      notes: ''
    });
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'makeup': return 'bg-yellow-100 text-yellow-800';
      case 'substitute': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckIcon className="h-4 w-4" />;
      case 'absent': return <XMarkIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Group classes by time for better display
  const classesByTime = classes.reduce((acc, classItem) => {
    const time = classItem.start_time;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(classItem);
    return acc;
  }, {});

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
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track student attendance and record notes
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Record Attendance
          </button>
        </div>
      </div>

      {/* Attendance by Time Slots */}
      <div className="space-y-6">
        {Object.entries(classesByTime).map(([time, timeClasses]) => (
          <div key={time} className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                {time} - {timeClasses[0].end_time}
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {timeClasses.map((classItem) => {
                const attendanceRecord = attendance.find(a => a.class_id === classItem.id);
                return (
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
                              {attendanceRecord && (
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendanceRecord.status)}`}>
                                  {getStatusIcon(attendanceRecord.status)}
                                  <span className="ml-1">{attendanceRecord.status}</span>
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {classItem.days_of_week} • {classItem.duration_minutes} minutes
                              {attendanceRecord && attendanceRecord.minutes_attended && (
                                <span className="ml-2">• Attended: {attendanceRecord.minutes_attended} min</span>
                              )}
                            </div>
                            {attendanceRecord && attendanceRecord.notes && (
                              <div className="mt-1 text-sm text-gray-600">
                                Notes: {attendanceRecord.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!attendanceRecord ? (
                            <>
                              <button
                                onClick={() => handleQuickAttendance(classItem.id, classItem.student_id, 'present')}
                                className="text-green-600 hover:text-green-900 text-sm font-medium"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleQuickAttendance(classItem.id, classItem.student_id, 'absent')}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Absent
                              </button>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Recorded
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {Object.keys(classesByTime).length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No classes scheduled for this date.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Record Attendance
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Class *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.class_id}
                    onChange={(e) => {
                      const selectedClass = classes.find(c => c.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        class_id: e.target.value,
                        student_id: selectedClass?.student_id || '',
                        date: selectedDate
                      });
                    }}
                  >
                    <option value="">Select a class</option>
                    {classes.map(classItem => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.student_name} - {classItem.start_time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Status *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="makeup">Makeup</option>
                    <option value="substitute">Substitute</option>
                  </select>
                </div>

                <div>
                  <label className="label">Minutes Attended</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.minutes_attended}
                    onChange={(e) => setFormData({...formData, minutes_attended: e.target.value})}
                  />
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
                    Record
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

export default Attendance;
