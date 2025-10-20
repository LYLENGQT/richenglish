import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import swal from 'sweetalert2';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManager, setFilterManager] = useState('all');
  const [filterNationality, setFilterNationality] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: 'KOREAN',
    manager_type: 'KM',
    email: '',
    book: '',
    category_level: '',
    class_type: '',
    platform: 'Zoom',
    platform_link: '',
    teacher_id: 1
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age || '',
      nationality: student.nationality,
      manager_type: student.manager_type,
      email: student.email || '',
      book: student.book || '',
      category_level: student.category_level || '',
      class_type: student.class_type || '',
      platform: student.platform,
      platform_link: student.platform_link || '',
      teacher_id: student.teacher_id || 1
    });
    setShowModal(true);
  };

const handleDelete = async (id, name) => {
  const result = await swal.fire({
    title: 'Are you sure?',
    text: `${name} will be deleted permanently!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    }
  }
}

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      nationality: 'KOREAN',
      manager_type: 'KM',
      email: '',
      book: '',
      category_level: '',
      class_type: '',
      platform: 'Zoom',
      platform_link: '',
      teacher_id: 1
    });
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    resetForm();
    setShowModal(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesManager = filterManager === 'all' || student.manager_type === filterManager;
    const matchesNationality = filterNationality === 'all' || student.nationality === filterNationality;
    
    return matchesSearch && matchesManager && matchesNationality;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Korean and Chinese students
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="label">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="label">Manager Type</label>
            <select
              className="input-field"
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
            >
              <option value="all">All Managers</option>
              <option value="KM">Korean Manager (KM)</option>
              <option value="CM">Chinese Manager (CM)</option>
            </select>
          </div>
          
          <div>
            <label className="label">Nationality</label>
            <select
              className="input-field"
              value={filterNationality}
              onChange={(e) => setFilterNationality(e.target.value)}
            >
              <option value="all">All Nationalities</option>
              <option value="KOREAN">Korean</option>
              <option value="CHINESE">Chinese</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterManager('all');
                setFilterNationality('all');
              }}
              className="btn-secondary w-full"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <li key={student.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                      student.manager_type === 'KM' ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.manager_type === 'KM' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.manager_type}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {student.age ? `Age: ${student.age}` : 'Adult'} • {student.nationality}
                        {student.email && ` • ${student.email}`}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {student.book && `Book: ${student.book}`}
                        {student.category_level && ` • Level: ${student.category_level}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id, student.name)}
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
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nationality *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    >
                      <option value="KOREAN">Korean</option>
                      <option value="CHINESE">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Manager Type *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.manager_type}
                      onChange={(e) => setFormData({...formData, manager_type: e.target.value})}
                    >
                      <option value="KM">Korean Manager (KM)</option>
                      <option value="CM">Chinese Manager (CM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Book</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.book}
                    onChange={(e) => setFormData({...formData, book: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Category/Level</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.category_level}
                    onChange={(e) => setFormData({...formData, category_level: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Platform</label>
                    <select
                      className="input-field"
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    >
                      <option value="Zoom">Zoom</option>
                      <option value="Voov">Voov</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Platform Link</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.platform_link}
                      onChange={(e) => setFormData({...formData, platform_link: e.target.value})}
                    />
                  </div>
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
                    {editingStudent ? 'Update' : 'Create'}
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

export default Students;
