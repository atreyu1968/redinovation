import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AcademicYearCard from '../components/academic-years/AcademicYearCard';
import AcademicYearForm from '../components/academic-years/AcademicYearForm';
import { useAcademicYearStore } from '../stores/academicYearStore';
import type { AcademicYear, AcademicYearFormData } from '../types/academicYear';

const AcademicYears = () => {
  const { years, fetchYears, addYear, updateYear } = useAcademicYearStore();
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleCreateYear = async (data: AcademicYearFormData) => {
    await addYear(data);
    setShowForm(false);
  };

  const handleEditYear = (year: AcademicYear) => {
    setEditingYear(year);
    setShowForm(true);
  };

  const handleUpdateYear = async (data: AcademicYearFormData) => {
    if (!editingYear) return;
    await updateYear(editingYear.id, data);
    setShowForm(false);
    setEditingYear(null);
  };

  const handleToggleQuarter = async (yearId: string, quarterId: string) => {
    const year = years.find(y => y.id === yearId);
    if (!year) return;

    const updatedYear = {
      ...year,
      quarters: year.quarters.map(quarter =>
        quarter.id === quarterId
          ? { ...quarter, isActive: !quarter.isActive }
          : quarter
      ),
    };

    await updateYear(yearId, updatedYear);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Cursos Académicos
        </h1>
        <button
          onClick={() => {
            setEditingYear(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Curso</span>
        </button>
      </div>

      <div className="space-y-4">
        {years.map((year) => (
          <AcademicYearCard
            key={year.id}
            academicYear={year}
            onEdit={handleEditYear}
            onToggleQuarter={handleToggleQuarter}
          />
        ))}
      </div>

      {showForm && (
        <AcademicYearForm
          onSubmit={editingYear ? handleUpdateYear : handleCreateYear}
          onClose={() => {
            setShowForm(false);
            setEditingYear(null);
          }}
          initialData={editingYear || undefined}
        />
      )}
    </div>
  );
};

export default AcademicYears;